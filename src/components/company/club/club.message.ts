export const CONFIRM_REGISTRATION_MESSAGE = (email: string, tokenUrl: string) => ({
  to: email,
  from: process.env.GMAIL_USERNAME || '',
  attachDataUrls: true,
  generateTextFromHTML: true,
  subject: `【${process.env.APP_TITLE}】メールアドレスの確認のお知らせ`,
  html: `<p>このメールに心当たりがない場合は、このメールを無視してください。</p>
    <p>登録のためにメールアドレスの確認を行ってます。以下のリンクをクリックして登録を開始してください。</p>
    <a href="${tokenUrl}">${tokenUrl}</a>`,
});

export const CONTRACT_MESSAGE = (name: string, title: string, toEmail: string, content: string) => ({
  to:
    process.env.NODE_ENV === 'production'
      ? ['rei.orikata@willeder.com', 'info@sponsors-boost.com']
      : ['hemakumarm72@gmail.com'] || '',
  from: process.env.GMAIL_USERNAME || '',
  attachDataUrls: true,
  generateTextFromHTML: true,
  subject: `【${process.env.APP_TITLE}】お問い合わせが入りました。`,
  html: `<p><strong>メールアドレス:</strong> ${toEmail}</p>
      <p><strong>名前:</strong> ${name}</p>
      <p><strong>タイトル:</strong> ${title}</p>
    <p><strong>内容: ${content}</strong></p>`,
});
