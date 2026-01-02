'use client'

import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import * as Y from 'yjs'
import { yDrawingsAtom, YJS_ORIGIN, YjsOrigin } from '../atoms/yjsAtom'
import { yMapVersionAtom } from '../atoms/drawingHistoryAtom'
import { socketAtom, roomIdAtom } from '../atoms/socketAtom'
import { Drawing } from '../types'

// Yjsの全ての変更（ローカル・リモート）を検知し、Jotaiに通知するProvider
// ローカル変更時はサーバーへ送信、リモート変更時はUI更新のみ
export const YjsProvider = ({ children }: { children: React.ReactNode }) => {
  const yDrawings = useAtomValue(yDrawingsAtom)
  const setYMapVersion = useSetAtom(yMapVersionAtom)
  const socket = useAtomValue(socketAtom)
  const roomId = useAtomValue(roomIdAtom)

  useEffect(() => {
    const observer = (event: Y.YMapEvent<Drawing>) => {
      const origin = event.transaction.origin as YjsOrigin
      // リモートからの変更は何もしない
      if (origin === YJS_ORIGIN.REMOTE) return

      const updated: Drawing[] = []

      event.changes.keys.forEach((change, key) => {
        if (change.action !== 'delete') {
          // 追加または更新対象の値を取得
          const drawing = yDrawings.get(key)
          if (drawing) updated.push(drawing)
        } else {
          // 削除対象の値を取得
          const drawing = change.oldValue as Drawing
          if (drawing) updated.push(drawing)
        }
      })

      if (socket && roomId && updated.length > 0) {
        socket.emit(origin, { roomId, drawings: updated })
      }

      setYMapVersion((v) => v + 1)
    }

    yDrawings.observe(observer)

    return () => {
      yDrawings.unobserve(observer)
    }
  }, [yDrawings, socket, roomId, setYMapVersion])

  return <>{children}</>
}
