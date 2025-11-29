export default defineEventHandler(async (event) => {
  const username = 'budaobu'
  
  try {
    const response = await $fetch(`https://api.github.com/users/${username}`)
    
    return {
      avatar_url: response.avatar_url,
      html_url: response.html_url,
      name: response.name || username
    }
  } catch (error) {
    return {
      avatar_url: `https://github.com/${username}.png`,
      html_url: `https://github.com/${username}`,
      name: username
    }
  }
})