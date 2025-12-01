export default defineCachedEventHandler(async (event) => {
  const username = 'budaobu'
  const fallbackUrl = `https://github.com/${username}.png`

  try {
    // 1. 获取 GitHub 用户信息以得到最新的头像 URL
    // (虽然 github.com/username.png 会重定向，但我们这里为了保险直接获取最终图片)
    // 或者直接 fetch fallbackUrl (它会自动跟随重定向)
    const imageBuffer = await $fetch(fallbackUrl, {
      responseType: 'arrayBuffer'
    })

    // 2. 设置响应头，告诉浏览器这是一张图片
    setResponseHeader(event, 'Content-Type', 'image/png')
    // 3. 设置浏览器缓存 (客户端缓存 1 天)
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')

    return imageBuffer
  } catch (error) {
    // 如果出错，重定向到默认头像，保证不挂
    return sendRedirect(event, fallbackUrl)
  }
}, {
  // Nitro 服务端缓存配置
  maxAge: 60 * 60 * 24 * 7, // 缓存 7 天 (秒)
  name: 'github-avatar', // 缓存键名
  getKey: () => 'avatar' // 固定 Key，保证所有人访问到同一份缓存
})