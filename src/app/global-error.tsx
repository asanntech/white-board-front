'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { ErrorPage } from '@/components/error'
import { BackHomeButton } from '@/components/button'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error)
    }
  }, [error])

  return (
    <html>
      <body>
        <ErrorPage
          status="!"
          title="不明なエラーが発生しました"
          message="再度お試しください。"
          primaryAction={<BackHomeButton />}
        />
      </body>
    </html>
  )
}
