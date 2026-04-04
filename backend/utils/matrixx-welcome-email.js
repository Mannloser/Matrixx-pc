// matrixx-welcome-email.js
// Usage: pass `getWelcomeEmailHtml(email)` to nodemailer's `html` field

export function getWelcomeEmailHtml(username = "Builder") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Matrixx</title>
</head>
<body style="margin:0;padding:0;background:#F5EFEB;font-family:'DM Sans',Arial,sans-serif;">

  <!-- Preheader (hidden) -->
  <span style="display:none;max-height:0;overflow:hidden;">
    Your build starts here. Welcome to Matrixx 🖥️
  </span>

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background:#F5EFEB;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:600px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:#2F4156;border-radius:20px 20px 0 0;padding:36px 48px 28px;text-align:left;">

              <!-- Logo row -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <span style="
                      font-family:'Syne',Arial,sans-serif;
                      font-size:22px;
                      font-weight:800;
                      color:#FFFFFF;
                      letter-spacing:-0.5px;">
                      Matrixx
                    </span>
                    <span style="
                      display:inline-block;
                      margin-left:10px;
                      font-size:10px;
                      font-weight:700;
                      letter-spacing:0.1em;
                      text-transform:uppercase;
                      color:#C8D9E6;
                      background:rgba(200,217,230,0.12);
                      border:1px solid rgba(200,217,230,0.25);
                      border-radius:100px;
                      padding:3px 10px;
                      vertical-align:middle;">
                      PC Marketplace
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:rgba(200,217,230,0.15);margin:24px 0;"></div>

              <!-- Headline -->
              <h1 style="
                margin:0 0 12px;
                font-family:'Syne',Arial,sans-serif;
                font-size:36px;
                font-weight:800;
                color:#FFFFFF;
                letter-spacing:-1.5px;
                line-height:1.05;">
                Welcome,<br/>
                <span style="color:#C8D9E6;">${username}.</span>
              </h1>
              <p style="
                margin:0;
                font-size:15px;
                font-weight:300;
                color:rgba(200,217,230,0.75);
                line-height:1.65;
                max-width:400px;">
                Your account is live. Start exploring builds, listing parts, and connecting with the PC community.
              </p>

            </td>
          </tr>

          <!-- ── HERO STRIP ── -->
          <tr>
            <td style="background:#5D7C8D;padding:18px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="color:rgba(255,255,255,0.6);font-size:12px;font-weight:400;">
                    🖥️ &nbsp;Build. List. Trade. Repeat.
                  </td>
                  <td align="right">
                    <span style="
                      display:inline-block;
                      width:8px;height:8px;
                      border-radius:50%;
                      background:#4ade80;
                      vertical-align:middle;
                      margin-right:6px;">
                    </span>
                    <span style="color:rgba(255,255,255,0.7);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">
                      Account Active
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background:#FFFFFF;padding:44px 48px;">

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="padding-bottom:40px;">
                    <a href="http://localhost:5173/"
                      style="
                        display:inline-block;
                        background:#2F4156;
                        color:#FFFFFF;
                        font-family:'Syne',Arial,sans-serif;
                        font-size:15px;
                        font-weight:700;
                        letter-spacing:-0.2px;
                        text-decoration:none;
                        padding:16px 44px;
                        border-radius:10px;">
                      Go to Home &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:#C8D9E6;margin-bottom:36px;"></div>

              <!-- Feature highlights -->
              <p style="
                margin:0 0 24px;
                font-family:'Syne',Arial,sans-serif;
                font-size:13px;
                font-weight:700;
                letter-spacing:0.1em;
                text-transform:uppercase;
                color:#5D7C8D;">
                What you can do
              </p>

              <!-- Feature 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="margin-bottom:20px;">
                <tr>
                  <td width="48" valign="top">
                    <div style="
                      width:40px;height:40px;
                      background:#F5EFEB;
                      border:1.5px solid #C8D9E6;
                      border-radius:10px;
                      text-align:center;
                      line-height:40px;
                      font-size:18px;">
                      🛒
                    </div>
                  </td>
                  <td style="padding-left:16px;" valign="top">
                    <p style="margin:0 0 4px;font-family:'Syne',Arial,sans-serif;font-weight:700;font-size:14px;color:#2F4156;">
                      Browse &amp; Build your dream PC
                    </p>
                    <p style="margin:0;font-size:13px;font-weight:300;color:#5D7C8D;line-height:1.55;">
                      Shop CPUs, GPUs, RAM, storage and more — sourced from real builders.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Feature 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="margin-bottom:20px;">
                <tr>
                  <td width="48" valign="top">
                    <div style="
                      width:40px;height:40px;
                      background:#F5EFEB;
                      border:1.5px solid #C8D9E6;
                      border-radius:10px;
                      text-align:center;
                      line-height:40px;
                      font-size:18px;">
                      🔧
                    </div>
                  </td>
                  <td style="padding-left:16px;" valign="top">
                    <p style="margin:0 0 4px;font-family:'Syne',Arial,sans-serif;font-weight:700;font-size:14px;color:#2F4156;">
                      Save Your Build
                    </p>
                    <p style="margin:0;font-size:13px;font-weight:300;color:#5D7C8D;line-height:1.55;">
                      Save your build and share it with the community.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Feature 3 -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="margin-bottom:20px;">
                <tr>
                  <td width="48" valign="top">
                    <div style="
                      width:40px;height:40px;
                      background:#F5EFEB;
                      border:1.5px solid #C8D9E6;
                      border-radius:10px;
                      text-align:center;
                      line-height:40px;
                      font-size:18px;">
                      🏆
                    </div>
                  </td>
                  <td style="padding-left:16px;" valign="top">
                    <p style="margin:0 0 4px;font-family:'Syne',Arial,sans-serif;font-weight:700;font-size:14px;color:#2F4156;">
                      Explore premium builds
                    </p>
                    <p style="margin:0;font-size:13px;font-weight:300;color:#5D7C8D;line-height:1.55;">
                      Get inspired by prebuilt systems and show off your own setup.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:#C8D9E6;margin:32px 0;"></div>

              <!-- Closing note -->
              <p style="margin:0;font-size:14px;font-weight:300;color:#5D7C8D;line-height:1.7;">
                If you have any questions, just reply to this email — we're always happy to help.
                <br/><br/>
                Happy building,<br/>
                <strong style="font-family:'Syne',Arial,sans-serif;color:#2F4156;font-weight:700;">
                  The Matrixx Team
                </strong>
              </p>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#2F4156;border-radius:0 0 20px 20px;padding:28px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <!-- Social links -->
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
                      <tr>
                        <td style="padding-right:16px;">
                          <a href="#"
                            style="font-size:12px;color:rgba(200,217,230,0.6);text-decoration:none;font-weight:500;">
                            Twitter
                          </a>
                        </td>
                        <td style="padding-right:16px;">
                          <a href="#"
                            style="font-size:12px;color:rgba(200,217,230,0.6);text-decoration:none;font-weight:500;">
                            Discord
                          </a>
                        </td>
                        <td>
                          <a href="https://instagram.com/mannloser"
                            style="font-size:12px;color:rgba(200,217,230,0.6);text-decoration:none;font-weight:500;">
                            Instagram
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0;font-size:11px;color:rgba(200,217,230,0.4);line-height:1.6;">
                      You received this because you created an account on Matrixx.<br/>
                      &copy; 2026 Matrixx &mdash; All rights reserved.<br/>
                      <a href="#" style="color:rgba(200,217,230,0.4);text-decoration:underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}