export const CONFIRM_REGISTRATION_MESSAGE = (email: string, password: string) => ({
  to: email,
  from: process.env.GMAIL_USERNAME || '',
  attachDataUrls: true,
  generateTextFromHTML: true,
  subject: `【${process.env.APP_TITLE}】 メールアドレスの確認のお知らせ`,
  html: `<p>このメールに心当たりがない場合は、無視してください。</p>
  <p>登録用のメールアドレスを確認させていただきます。ログインの詳細は次のとおりです。</p>
     email :${email} <br> password: ${password}  <br>
  <p>企業用のログイン  <a href="https://sponsors-boost.com/login">https://sponsors-boost.com/login</a></p>   
     `,
});
