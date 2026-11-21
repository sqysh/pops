export const contactSubmissionTemplate = (submitterName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission - The Pops Orchestra</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f0f0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f0f0f;">
    <tr>
      <td style="padding: 32px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; margin: 0 auto;">

          <!-- Header -->
          <tr>
            <td style="padding: 0 0 24px 0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #ff9000;">Bradenton & Sarasota</p>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.02em;">
                <span style="color: #ffffff;">THE </span><span style="background: linear-gradient(90deg, #da0032, #ff9000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">POPS</span><span style="color: #ffffff;"> ORCHESTRA</span>
              </h1>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background: #1a1a1a; border-radius: 14px; overflow: hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height: 5px; background: linear-gradient(90deg, #da0032 0%, #ff9000 100%);"></td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 32px; text-align: center;">

                    <p style="margin: 0 0 8px 0; color: #ff9000; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">New Message</p>
                    <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 20px; font-weight: 700;">New Contact Message</h2>

                    <p style="margin: 0 0 24px 0; color: #94a3b8; font-size: 15px; line-height: 1.7;">
                      <strong style="color: #e2e8f0;">${submitterName}</strong> has submitted a message through the contact form.
                    </p>

                    <a href="https://thepopsorchestra.org/admin/dashboard" style="display: inline-block; padding: 13px 28px; background: linear-gradient(90deg, #da0032, #ff9000); color: white; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
                      View Message
                    </a>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 0 0 0; text-align: center;">
              <p style="margin: 0; color: #334155; font-size: 11px;">
                © 2026 The Pops Orchestra of Bradenton &amp; Sarasota
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
