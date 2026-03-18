export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. 验证必要字段
  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  // 2. 获取 API Key 和收件人邮箱 (通过 Nuxt Runtime Config)
  // 对应 nuxt.config.ts 中的 runtimeConfig.resendApiKey 和 resendToEmail
  const config = useRuntimeConfig()
  const resendApiKey = config.resendApiKey
  const resendToEmail = config.resendToEmail

  if (!resendApiKey) {
    console.error('RESEND_API_KEY is missing in runtime config')
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: API Key missing'
    })
  }

  if (!resendToEmail) {
    console.error('RESEND_TO_EMAIL is missing in runtime config')
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Target email missing'
    })
  }

  try {
    // 3. 调用 Resend API
    const data = await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        // 注意：如果你没有在 Resend 绑定域名，必须使用 'onboarding@resend.dev'
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [resendToEmail], 
        subject: `New Message from ${body.name}`,
        reply_to: body.email,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${body.message}</p>
        `,
      },
    })

    return { success: true, data }
  } catch (error: any) {
    console.error('Resend API Error:', error)
    // 返回更详细的错误信息以便调试（生产环境可简化）
    throw createError({
      statusCode: 500,
      statusMessage: error.statusMessage || 'Failed to send email',
      data: error.data
    })
  }
})