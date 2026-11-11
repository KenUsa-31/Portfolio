import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))
app.use(express.json())

const submissions = new Map()

function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now()
  const timestamps = (submissions.get(ip) || []).filter(t => now - t < windowMs)
  if (timestamps.length >= limit) return false
  timestamps.push(now)
  submissions.set(ip, timestamps)
  return true
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEmailHtml({ name, email, message, date }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>New Message from Portfolio</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);padding:36px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);display:inline-block;line-height:56px;font-size:24px;color:#ffffff;text-align:center;">&#9993;</div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Portfolio Contact Form</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:6px;">
                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);">New message received from your website</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">

                <!-- Name -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8f9fa;border-radius:12px;border:1px solid #e9ecef;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;padding-top:2px;">
                                <div style="width:36px;height:36px;border-radius:10px;background-color:#e8f5e9;display:inline-block;text-align:center;line-height:36px;font-size:16px;color:#2e7d32;">&#128100;</div>
                              </td>
                              <td style="padding-left:16px;">
                                <p style="margin:0;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;">Name</p>
                                <p style="margin:6px 0 0;font-size:16px;color:#1a1a1a;font-weight:500;">${escapeHtml(name)}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8f9fa;border-radius:12px;border:1px solid #e9ecef;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;padding-top:2px;">
                                <div style="width:36px;height:36px;border-radius:10px;background-color:#e3f2fd;display:inline-block;text-align:center;line-height:36px;font-size:16px;color:#1565c0;">&#9993;</div>
                              </td>
                              <td style="padding-left:16px;">
                                <p style="margin:0;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;">Email</p>
                                <p style="margin:6px 0 0;font-size:16px;color:#1a1a1a;font-weight:500;">
                                  <a href="mailto:${escapeHtml(email)}" style="color:#1565c0;text-decoration:none;">${escapeHtml(email)}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8f9fa;border-radius:12px;border:1px solid #e9ecef;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;padding-top:2px;">
                                <div style="width:36px;height:36px;border-radius:10px;background-color:#fff3e0;display:inline-block;text-align:center;line-height:36px;font-size:16px;color:#e65100;">&#128221;</div>
                              </td>
                              <td style="padding-left:16px;">
                                <p style="margin:0;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;">Message</p>
                                <p style="margin:6px 0 0;font-size:16px;color:#1a1a1a;font-weight:400;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Date & Time -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f4ff;border-radius:12px;border:1px solid #d6e0ff;">
                      <tr>
                        <td style="padding:16px 24px;text-align:center;">
                          <p style="margin:0;font-size:13px;color:#555;">
                            <span style="color:#1565c0;font-weight:600;">&#128197; Submitted:</span>&nbsp;
                            <span style="color:#1a1a1a;">${date}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Reply Button -->
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:10px;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);">
                          <a href="mailto:${escapeHtml(email)}?subject=Re:%20Your%20message%20from%20my%20portfolio" style="display:inline-block;padding:14px 36px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">Reply to Sender &rarr;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fa;padding:24px 40px;border-radius:0 0 16px 16px;border-top:1px solid #e9ecef;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
                This email was generated from your portfolio website<br>
                <span style="color:#bbb;">&copy; ${new Date().getFullYear()} Ken Andrei Usa &mdash; All rights reserved</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

app.post('/api/contact', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  if (name.length > 100 || email.length > 100 || message.length > 2000) {
    return res.status(400).json({ error: 'Input too long.' })
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: buildEmailHtml({ name, email, message, date: `${date} at ${time}` }),
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSubmitted: ${date} at ${time}`,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
