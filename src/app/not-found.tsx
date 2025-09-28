'use client'

import { useRouter } from 'next/navigation'
import { ErrorPage } from '@/components/error'
import { BackHomeButton } from '@/components/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <ErrorPage
      status="404"
      title="ページが見つかりません"
      message="お探しのページは存在しないか、移動された可能性があります。"
      primaryAction={<BackHomeButton />}
      secondaryAction={
        <button
          onClick={() => router.back()}
          className="text-emerald-500 font-bold py-2 px-4 border border-emerald-500 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          前のページに戻る
        </button>
      }
    />
  )
}
