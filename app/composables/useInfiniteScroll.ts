import type { UseFetchOptions } from 'nuxt/app'

// 定义后端 API 返回的分页数据结构
interface PaginationResponse<T> {
  items: T[]
  hasMore: boolean
  total?: number
}

/**
 * 通用无限滚动 Composable
 * @param apiUrl - 请求的 API 端点 (例如 '/api/projects')
 * @param pageSize - 每页加载数量 (默认为 9)
 * @param options - 传递给 useFetch 的额外选项
 */
export async function useInfiniteScroll<T>(
  apiUrl: string, 
  pageSize: number = 9,
  options: UseFetchOptions<PaginationResponse<T>> = {}
) {
  // 1. 状态定义
  const page = ref(1)
  const allItems = ref<T[]>([]) as Ref<T[]>
  const hasMore = ref(false)
  const loadingMore = ref(false)
  const loadMoreTrigger = ref<HTMLElement | null>(null)

  // 2. 定义加载更多函数 (需在 onMounted 前定义)
  const loadMore = async () => {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true

    try {
      const nextPage = page.value + 1
      const response = await $fetch<PaginationResponse<T>>(apiUrl, {
        query: { page: nextPage, limit: pageSize }
      })

      if (response) {
        allItems.value.push(...response.items)
        hasMore.value = response.hasMore
        page.value = nextPage
      }
    } catch (err) {
      console.error('Failed to load more data:', err)
    } finally {
      loadingMore.value = false
    }
  }

  // 3. 注册生命周期钩子 (关键修复：必须在 await 之前！)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore.value && hasMore.value) {
        loadMore()
      }
    }, { rootMargin: '200px' })

    // 监听 DOM ref 变化
    watch(loadMoreTrigger, (el) => {
      if (el) observer?.observe(el)
      else observer?.disconnect()
    }, { immediate: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  // 4. 数据获取 (await 操作放在生命周期注册之后)
  const { data, pending, error } = await useFetch<PaginationResponse<T>>(apiUrl, {
    lazy: true,
    query: { page: 1, limit: pageSize },
    ...options,
    watch: false 
  })

  // 5. 监听数据变化
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
    loadMoreTrigger
  }
}