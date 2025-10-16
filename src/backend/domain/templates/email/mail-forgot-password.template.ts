export class MailForgotPasswordTemplate {
  static template({ name, pin, expireInHours }: { name: string; email: string; pin: string; expireInHours: number }): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset - SaaS Multi Tenant</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #e3f2fd, #ffffff);
      margin: 0;
      padding: 0;
      color: #333;
    }

    .container {
      max-width: 580px;
      margin: 50px auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(90deg, #1e88e5, #42a5f5);
      color: #fff;
      text-align: center;
      padding: 25px 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 30px 25px;
    }

    .content p {
      font-size: 15px;
      line-height: 1.6;
      margin: 15px 0;
    }

    .pin-box {
      background: #e3f2fd;
      border: 2px dashed #2196f3;
      border-radius: 10px;
      padding: 25px;
      text-align: center;
      margin: 30px 0;
    }

    .pin-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .pin-value {
      font-size: 36px;
      font-weight: bold;
      color: #1565c0;
      letter-spacing: 6px;
    }

    .footer {
      background: #f9f9f9;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #777;
      border-top: 1px solid #eee;
    }

    .highlight {
      color: #e53935;
      font-weight: bold;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        We received a request to reset your password for your
        <strong>SaaS Multi Tenant - Emmerson Oliveira</strong> account.
        Please use the 6-digit PIN below to proceed with your password reset:
      </p>

      <div class="pin-box">
        <div class="pin-label">Your 6-digit PIN:</div>
        <div class="pin-value">${pin}</div>
      </div>

      <p class="highlight">
        For security reasons, this PIN will expire in ${expireInHours} hours.
      </p>

      <p>
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

      <p>
        Need help? Our support team is here for you anytime.
      </p>

      <p>Best regards,<br /><strong>The SaaS Multi Tenant Team</strong></p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} SaaS Multi Tenant - Emmerson Oliveira. All rights reserved.
    </div>
  </div>
</body>
</html>`;
  }
}
