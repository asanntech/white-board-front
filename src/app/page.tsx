const loginUrl =
  `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize` +
  `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
  `&response_type=code` +
  `&scope=openid+email+profile` +
  `&redirect_uri=${process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI}` +
  `&lang=ja`

export default function Home() {
  return <a href={loginUrl}>Sign in with Cognito</a>
}
