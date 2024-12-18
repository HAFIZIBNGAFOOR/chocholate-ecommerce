export const MESSAGE_RESET_PASSWORD = (email: string, tokenUrl: string) => ({
  to: email,
  from: process.env.GMAIL_USERNAME || '',
  attachDataUrls: true,
  generateTextFromHTML: true,
  subject: `【${process.env.APP_TITLE}】パスワードリセットのお知らせ`,
  html: `<p>このメールに心当たりがない場合は、このメールを無視してください。</p>
    <p>パスワードをリセットするには、以下のリンクをクリックしてください。</p>
    <a href="${tokenUrl}">${tokenUrl}</a>`,
});
