import { FallbackProps } from 'react-error-boundary'

export const ErrorFallback = ({ error }: FallbackProps) => {
  switch (error.status) {
    case 401:
      return <AuthError />
    default:
      return <div>Something went wrong</div>
  }
}

const AuthError = () => {
  return <div>認証エラー</div>
}
