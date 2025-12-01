export default defineCachedEventHandler(async (event) => {
  // 1. 定义你的 GitHub 用户名
  const username = 'budaobu'
  
  // 2. 这里我们不下载图片流，而是直接构造 GitHub 的头像地址
  // github.com/username.png 是 GitHub 官方提供的稳定头像重定向地址
  // 或者使用 https://avatars.githubusercontent.com/u/ID 也可以
  const targetUrl = `https://github.com/${username}.png`

  // 3. 直接发送重定向指令 (307 Temporary Redirect)
  // 浏览器收到这个响应后，会自动去 targetUrl 下载图片
  // 这样做避开了在 Worker 中处理二进制流的复杂性，100% 稳健
  return sendRedirect(event, targetUrl, 307)
}, {
  // 4. 对这个“重定向指令”进行缓存
  // 意味着 Cloudflare 在 7 天内，收到请求会直接告诉浏览器 "去 GitHub 拿"，
  // 而不会真正去执行上面的代码逻辑，极速响应。
  maxAge: 60 * 60 * 24 * 7, // 7 天
  name: 'github-avatar-redirect',
  getKey: () => 'avatar-url'
})