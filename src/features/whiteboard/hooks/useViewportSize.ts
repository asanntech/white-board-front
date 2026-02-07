'use client'

import { useSyncExternalStore } from 'react'

type ViewportSize = { width: number; height: number }

export const useViewportSize = (): ViewportSize => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// キャッシュ用の変数
let cachedSnapshot: ViewportSize = { width: 0, height: 0 }

function subscribe(callback: () => void) {
  // window の resize
  window.addEventListener('resize', callback)
  // モバイルの URL バー上下で変わる visualViewport も監視
  const vv = window.visualViewport
  if (vv) vv.addEventListener('resize', callback)

  return () => {
    window.removeEventListener('resize', callback)
    if (vv) vv.removeEventListener('resize', callback)
  }
}

function getSnapshot(): ViewportSize {
  // URL バーの出入りも拾いたいなら visualViewport を優先
  const vw = window.visualViewport?.width ?? window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight
  const newWidth = Math.round(vw)
  const newHeight = Math.round(vh)

  // 値が変更された場合のみ新しいオブジェクトを作成
  if (cachedSnapshot.width !== newWidth || cachedSnapshot.height !== newHeight) {
    cachedSnapshot = { width: newWidth, height: newHeight }
  }

  return cachedSnapshot
}

function getServerSnapshot(): ViewportSize {
  return { width: 0, height: 0 }
}
