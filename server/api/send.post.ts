export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. 验证必要字段
  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  // 2. 获取 API Key (请在 Cloudflare Pages 后台或 .env 文件中设置 RESEND_API_KEY)
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('RESEND_API_KEY is missing')
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error',
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
        // TODO: 这里改成你自己的接收邮箱
        to: ['lizhaoshui@duck.com'], 
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
  } catch (error) {
    console.error('Resend API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email',
    })
  }
})