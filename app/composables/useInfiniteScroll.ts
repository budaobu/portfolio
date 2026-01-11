import type { UseFetchOptions } from 'nuxt/app'

interface PaginationResponse<T> {
  items: T[]
  hasMore: boolean
  total?: number
}

export async function useInfiniteScroll<T>(
  apiUrl: string, 
  pageSize: number = 9,
  options: UseFetchOptions<PaginationResponse<T>> = {}
) {
  const page = ref(1)
  const allItems = ref<T[]>([]) as Ref<T[]>
  const hasMore = ref(false)
  const loadingMore = ref(false)
  const loadMoreTrigger = ref<HTMLElement | null>(null)
  
  // 新增：错误状态管理
  const loadMoreError = ref<string | null>(null)
  const retryCount = ref(0)
  const MAX_RETRIES = 3

  const loadMore = async () => {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    loadMoreError.value = null // 重置错误状态

    try {
      const nextPage = page.value + 1
      const response = await $fetch<PaginationResponse<T>>(apiUrl, {
        query: { page: nextPage, limit: pageSize },
        // 新增：请求超时设置
        timeout: 10000
      })

      if (response) {
        allItems.value.push(...response.items)
        hasMore.value = response.hasMore
        page.value = nextPage
        retryCount.value = 0 // 成功后重置重试计数
      }
    } catch (err: any) {
      console.error('Failed to load more data:', err)
      
      // 新增：详细错误处理
      if (retryCount.value < MAX_RETRIES) {
        retryCount.value++
        loadMoreError.value = `Loading failed. Retrying (${retryCount.value}/${MAX_RETRIES})...`
        
        // 指数退避重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount.value))
        return loadMore() // 递归重试
      } else {
        loadMoreError.value = 'Failed to load more items. Please check your connection.'
        hasMore.value = false // 达到最大重试次数后停止尝试
      }
    } finally {
      loadingMore.value = false
    }
  }

  // 新增：手动重试函数
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

  const { data, pending, error } = await useFetch<PaginationResponse<T>>(apiUrl, {
    lazy: true,
    server: false, // 新增：仅客户端执行
    dedupe: 'cancel', // 新增：避免重复请求
    query: { page: 1, limit: pageSize },
    ...options,
    watch: false 
  })

  watch(data, (newVal) => {
    if (newVal) {
      allItems.value = newVal.items
      hasMore.value = newVal.hasMore
    }
  }, { immediate: true })

  return {
    items: allItems,
    pending,
    error,
    hasMore,
    loadMoreTrigger,
    loadMoreError, // 新增：暴露错误状态
    retry          // 新增：暴露重试函数
  }
}
