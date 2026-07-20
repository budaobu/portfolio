<script setup lang="ts">
import { ref, computed } from 'vue'


useHead({
  title: 'MarkItDown - Convert Any File to Markdown',
  script: [
    {
      src: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js',
      defer: true
    }
  ]
})

const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val) => {
    colorMode.preference = val ? 'dark' : 'light'
  }
})
const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// --- State ---
const file = ref<File | null>(null)
const isProcessing = ref(false)
const isDownloadingModel = ref(false)
const resultText = ref('')
const resultFilename = ref('')
const activeTab = ref(0) // 0: Source, 1: Preview
const parsedContent = ref(null)

const renderMarkdown = async () => {
  if (!resultText.value) return
  
  try {
    const data = await $fetch('/api/markdown', {
      method: 'POST',
      body: { content: resultText.value }
    })
    parsedContent.value = data
  } catch (e) {
    console.error('Failed to render markdown', e)
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 1) {
    renderMarkdown()
  }
})

const dragOver = ref(false)

// --- File Handling ---
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    setFile(event.dataTransfer.files[0])
  }
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    setFile(input.files[0])
  }
}

const setFile = (f: File) => {
  file.value = f
  resultText.value = ''
  resultFilename.value = ''
  activeTab.value = 0
  startConversion() // Auto start as per requirement "download... then start calling"
}

const triggerFileInput = () => {
  const input = document.getElementById('file-upload') as HTMLInputElement
  if (input) input.click()
}

// --- Conversion Logic ---
// We use Pyodide to run the official Python markitdown package in the browser.
let pyodide: any = null

const waitForPyodide = async () => {
    let retries = 0
    // @ts-ignore
    while (!window.loadPyodide && retries < 50) {
        await new Promise(r => setTimeout(r, 200))
        retries++
    }
    // @ts-ignore
    if (!window.loadPyodide) throw new Error("Pyodide script failed to load from CDN")
    // @ts-ignore
    return window.loadPyodide
}

const loadPyodideEnvironment = async () => {
  if (pyodide) return pyodide
  
  isDownloadingModel.value = true
  try {
    const loadPyodideFunc = await waitForPyodide()
    pyodide = await loadPyodideFunc()
    
    // Load necessary packages
    await pyodide.loadPackage("micropip")
    const micropip = pyodide.pyimport("micropip")
    
    // 1. Mock heavy/binary dependencies that break Pyodide (WASM)
    // MarkItDown depends on onnxruntime and magika (Google's file detection)
    // Both rely on C-extensions/WASM not easily available or too heavy.
    // We mock them. MarkItDown will fallback to extension-based detection or fail gracefully on specific features.
    pyodide.runPython(`
      import sys
      from unittest.mock import MagicMock
      
      class MockModule(MagicMock):
          def __getattr__(self, name):
              return MagicMock()
      
      sys.modules["onnxruntime"] = MockModule()
      sys.modules["magika"] = MockModule()
    `)

    // 2. Install Safe Dependencies Manually
    // We load standard data science stack supported by Pyodide
    await pyodide.loadPackage(['pandas', 'beautifulsoup4', 'micropip'])
    
    // Install other pure python dependencies
    // Note: We try best effort support.
    try {
        // These are pure python wheels available on PyPI
        await micropip.install([
            'openpyxl', 
            'python-docx', 
            'pypdf', 
            'markdown', 
            'lxml', 
            'markdownify', 
            'defusedxml',
            'charset-normalizer',
            'requests',
            'mammoth',
            'xlrd',
            'python-pptx',
            'olefile',
            'pdfminer.six'
        ])
    } catch(e) { console.warn("Failed to install some optional deps", e) }

    // 3. Install markitdown WITHOUT dependencies
    // This requires passing deps=False to micropip.install
    // We do this via Python to ensure kwargs are handled correctly if JS bridge is finicky
    await pyodide.runPythonAsync(`
        import micropip
        await micropip.install('markitdown', deps=False)
    `)
    
    // We create a simple python wrapper script
    pyodide.runPython(`
      from markitdown import MarkItDown
      import os
      
      def convert_file(input_path):
          md = MarkItDown()
          result = md.convert(input_path)
          return result.text_content
    `)
    
    return pyodide
  } catch (e: any) {
    console.error("Failed to load Pyodide or MarkItDown", e)
    throw new Error(`Failed to initialize Python environment: ${e.message}`)
  } finally {
    isDownloadingModel.value = false
  }
}

const startConversion = async () => {
  if (!file.value) return

  isProcessing.value = true
  resultText.value = ''
  
  try {
    const py = await loadPyodideEnvironment()
    
    // 1. Write file to Pyodide FS
    const arrayBuffer = await file.value.arrayBuffer()
    const filename = file.value.name
    // Remove spaces/special chars from temp path to avoid issues, though FS handles most.
    const tempPath = '/tmp/' + filename
    
    py.FS.writeFile(tempPath, new Uint8Array(arrayBuffer))
    
    // 2. Call Python function
    const convertFunc = py.globals.get('convert_file')
    const markdown = convertFunc(tempPath)
    
    // 3. Cleanup
    try {
        py.FS.unlink(tempPath)
    } catch(e) {} // ignore cleanup errors
    
    if (markdown) {
       resultText.value = markdown
       const nameParts = file.value.name.split('.')
       if (nameParts.length > 1) nameParts.pop()
       resultFilename.value = nameParts.join('.') + '.md'
    } else {
       throw new Error("Conversion returned empty result")
    }

  } catch (error: any) {
    console.error(error)
    alert(`Conversion Failed: ${error.message || error}`)
  } finally {
    isProcessing.value = false
  }
}

// --- Helpers ---
const copyToClipboard = () => {
  if (!resultText.value) return
  navigator.clipboard.writeText(resultText.value)
  alert('Copied to clipboard!')
}

const downloadFile = () => {
  if (!resultText.value) return
  const blob = new Blob([resultText.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = resultFilename.value || 'converted.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div>
    <div class="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-16">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Convert Any File <br class="sm:hidden" /> to <span class="text-primary-600">Markdown</span> in Seconds.
          </h1>
          <p class="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Support for PDF, Word, Excel, PowerPoint and more. Secure, private, and runs entirely in your browser.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
          
          <!-- Upload Section -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col relative transition-shadow duration-300 ease-out hover:shadow-2xl">
            <div class="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
               <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 Source File
               </h3>
            </div>
            
            <div 
               class="flex-1 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative"
               :class="[
                 dragOver ? 'bg-primary-50/50 dark:bg-primary-900/20' : '',
                 (!file && !dragOver) ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''
               ]"
               @click="!file && triggerFileInput()"
               @dragover.prevent="dragOver = true"
               @dragleave.prevent="dragOver = false"
               @drop="handleDrop"
             >
               <input id="file-upload" type="file" class="hidden" @change="handleFileChange">
               
               <!-- Loading Overlay -->
               <div v-if="isProcessing || isDownloadingModel" class="absolute inset-0 z-20 bg-white/95 dark:bg-gray-900/95 flex flex-col items-center justify-center backdrop-blur-sm">
                  <div class="relative w-24 h-24 mb-6">
                    <UIcon name="i-heroicons-arrow-path" class="animate-spin w-full h-full text-primary-500" />
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ isDownloadingModel ? 'Downloading Model...' : 'Converting...' }}
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400 max-w-xs text-center">
                    {{ isDownloadingModel ? 'Setting up the conversion engine for the first time.' : 'Processing your file securely.' }}
                  </p>
               </div>

               <div v-if="!file" class="flex flex-col items-center gap-6">
                 <div class="w-24 h-24 rounded-full bg-primary-50 dark:bg-gray-800 flex items-center justify-center text-primary-500 dark:text-primary-400">
                     <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10" />
                 </div>
                 <div>
                   <p class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Click or Drag file here</p>
                   <p class="text-sm text-gray-500 dark:text-gray-400">Max file size 100MB</p>
                 </div>
               </div>

               <div v-else class="flex flex-col items-center w-full max-w-sm">
                 <div class="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                     <UIcon name="i-heroicons-document-check" class="w-10 h-10" />
                 </div>
                 <h4 class="text-lg font-bold text-gray-900 dark:text-white break-all mb-2">{{ file.name }}</h4>
                 <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">{{ formatSize(file.size) }}</p>
                 
                 <div class="flex gap-4 w-full">
                    <button @click.stop="triggerFileInput" class="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      Change
                    </button>
                    <button @click.stop="file = null; resultText = ''" class="flex-1 py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                      Remove
                    </button>
                 </div>
               </div>
            </div>
          </div>

          <!-- Result Section -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col relative transition-all duration-300 hover:shadow-2xl">
             <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50 h-[72px]">
                <div class="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
                   <button 
                     v-for="(t, i) in ['Markdown', 'Preview']" 
                     :key="i"
                     @click="activeTab = i"
                     class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                     :class="activeTab === i ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                   >
                     {{ t }}
                   </button>
                </div>
                
                <div class="flex gap-2">
                   <button 
                      @click="copyToClipboard" 
                      :disabled="!resultText"
                      class="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Copy"
                   >
                      <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5" />
                   </button>
                   <button 
                      @click="downloadFile" 
                      :disabled="!resultText"
                      class="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Download"
                   >
                      <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
                   </button>
                </div>
             </div>

             <div class="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-950/50 relative">
                <textarea 
                  v-if="activeTab === 0"
                  class="absolute inset-0 w-full h-full p-6 bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-800 dark:text-gray-300 leading-relaxed"
                  readonly 
                  :value="resultText"
                  placeholder="Converted markdown will appear here..."
                ></textarea>
                <div 
                  v-if="activeTab === 1" 
                  class="absolute inset-0 overflow-auto p-8 prose dark:prose-invert max-w-none prose-sm sm:prose-base bg-white dark:bg-gray-900"
                >
                  <ContentRenderer v-if="parsedContent" :value="parsedContent" />
                </div>
                
                <div v-if="!resultText" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 pointer-events-none opacity-50">
                    <UIcon name="i-heroicons-document-text" class="w-16 h-16 mb-4" />
                    <p class="text-lg font-medium">Waiting for content...</p>
                </div>
             </div>
          </div>
          
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Utilities */
:deep(.prose pre) {
  background-color: #f3f4f6;
  color: #1f2937;
  border-radius: 0.5rem;
}
.dark :deep(.prose pre) {
  background-color: #1f2937;
  color: #e5e7eb;
}
</style>
