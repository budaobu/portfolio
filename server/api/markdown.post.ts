import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content is required'
    })
  }

  // Generate a dummy ID for the parsed content
  const parsed = await parseMarkdown(body.content)
  return parsed
})
