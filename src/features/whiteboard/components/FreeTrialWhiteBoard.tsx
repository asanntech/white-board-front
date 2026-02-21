'use client'

import { useEffect } from 'react'
import { WhiteBoard } from './WhiteBoard'
import { useWhiteboardStore } from '../stores'

/**
 * Free Trial用のホワイトボード
 * SocketProvider無しでY.Docを初期化
 */
export const FreeTrialWhiteBoard = () => {
  const yDoc = useWhiteboardStore((s) => s.yDoc)
  const initYjs = useWhiteboardStore((s) => s.initYjs)

  useEffect(() => {
    if (!yDoc) {
      initYjs()
    }
  }, [yDoc, initYjs])

  return <WhiteBoard />
}
