import type { UseFetchOptions } from 'nuxt/app'

// 移除本地 interface PaginationResponse 定义
// 自动引用 app/utils/types.ts 中的 PaginatedResponse

export async function useInfiniteScroll<T>(
  apiUrl: string, 
  pageSize: number = 9,
  options: UseFetchOptions<PaginatedResponse<T>> = {} // 使用全局类型
) {
  const page = ref(1)
  const allItems = ref<T[]>([]) as Ref<T[]>
  const hasMore = ref(false)
  const loadingMore = ref(false)
  const loadMoreTrigger = ref<HTMLElement | null>(null)
  
  const loadMoreError = ref<string | null>(null)
  const retryCount = ref(0)
  const MAX_RETRIES = 3

  const loadMore = async () => {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    loadMoreError.value = null

    try {
      const nextPage = page.value + 1
      // 使用全局类型
      const response = await $fetch<PaginatedResponse<T>>(apiUrl, {
        query: { page: nextPage, limit: pageSize },
        timeout: 10000
      })

      if (response) {
        allItems.value.push(...response.items)
        hasMore.value = response.hasMore
        page.value = nextPage
        retryCount.value = 0
      }
    } catch (err: any) {
      console.error('Failed to load more data:', err)
      
      if (retryCount.value < MAX_RETRIES) {
        retryCount.value++
        loadMoreError.value = `Loading failed. Retrying (${retryCount.value}/${MAX_RETRIES})...`
        
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount.value))
        return loadMore()
      } else {
        loadMoreError.value = 'Failed to load more items. Please check your connection.'
        hasMore.value = false
      }
    } finally {
      loadingMore.value = false
    }
  }

  const retry = () => {
    retryCount.value = 0
    loadMoreError.value = null
    hasMore.value = true
    loadMore()
  }

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore.value && hasMore.value && !loadMoreError.value) {
        loadMore()
      }
    }, { rootMargin: '200px' })

    watch(loadMoreTrigger, (el) => {
      if (el) observer?.observe(el)
      else observer?.disconnect()
    }, { immediate: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  // 使用全局类型
  const { data, pending, error } = await useFetch<PaginatedResponse<T>>(apiUrl, {
    lazy: true,
    server: false,
    dedupe: 'cancel',
    query: { page: 1, limit: pageSize },
    ...options,
    watch: false 
  })

  // server:false 下服务端永远不请求，pending 在两端不一致；
  // 用 loaded 作为骨架屏/数据分支的统一判断依据，避免 hydration mismatch
  const loaded = ref(false)

  watch(data, (newVal) => {
    if (newVal) {
      allItems.value = newVal.items
      hasMore.value = newVal.hasMore
      loaded.value = true
    }
  }, { immediate: true })

  return {
    items: allItems,
    pending,
    error,
    loaded,
    hasMore,
    loadMoreTrigger,
    loadMoreError,
    retry
  }
}