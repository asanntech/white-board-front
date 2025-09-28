import { ReactNode } from 'react'

interface ErrorPageProps {
  status: ReactNode
  title: string
  message: string
  primaryAction: ReactNode
  secondaryAction?: ReactNode
}

export const ErrorPage = ({ status, title, message, primaryAction, secondaryAction }: ErrorPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-120 w-full text-center">
        {/* エラー イラスト */}
        <div className="mb-8">
          <div className="relative">
            {/* ホワイトボード風の背景 */}
            <div className="max-w-120 w-64 h-48 mx-auto bg-white border-2 border-emerald-200 rounded-lg shadow-lg relative overflow-hidden">
              {/* 方眼紙風の背景 */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" className="text-emerald-100">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* アイコン */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold text-emerald-500 opacity-80">{status}</div>
              </div>

              {/* 描画風の装飾 */}
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-emerald-300 rounded-full"></div>
              <div className="absolute top-8 right-6 w-4 h-4 bg-emerald-200 rounded-full"></div>
              <div className="absolute bottom-6 left-8 w-6 h-6 border-2 border-emerald-300 transform rotate-45"></div>
            </div>
          </div>
        </div>

        {/* メッセージ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-sm text-gray-600 mb-2">{message}</p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col gap-3">
          {primaryAction}
          {secondaryAction}
        </div>

        {/* フッター */}
        <div className="mt-8 text-xs text-gray-400">
          <p>White Board App</p>
        </div>
      </div>
    </div>
  )
}
