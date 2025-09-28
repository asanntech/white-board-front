import { FallbackProps } from 'react-error-boundary'
import * as Sentry from '@sentry/nextjs'
import { signInUrl } from '@/shared/constants'
import { ErrorPage } from './ErrorPage'
import { BackHomeButton } from '@/components/button'

export const ErrorFallback = ({ error }: FallbackProps) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error)
  }

  switch (error.status) {
    case 401:
      return <AuthError />
    default:
      return <SomethingError message={error.message} />
  }
}

const AuthError = () => {
  return (
    <ErrorPage
      status="401"
      title="認証エラー"
      message="認証情報が無効または期限切れの可能性があります。"
      primaryAction={
        <a
          href={signInUrl}
          className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-2xl cursor-pointer hover:opacity-70 transition-opacity shadow-lg"
        >
          ログインする
        </a>
      }
      secondaryAction={<BackHomeButton />}
    />
  )
}

const SomethingError = ({ message }: { message: string }) => {
  return <ErrorPage status="!" title="エラーが発生しました" message={message} primaryAction={<BackHomeButton />} />
}
