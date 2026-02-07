import { useCallback, useRef } from 'react'
import Konva from 'konva'

interface Point {
  x: number
  y: number
}

export const useMultiTouch = () => {
  // 前回の2本指の中心
  const lastCenterRef = useRef<Point | null>(null)
  // 前回の2本指の距離
  const lastDistRef = useRef<number>(0)

  // ピンチ＋パン開始（中心・距離の初期化）
  const startPanWithPinchZoom = useCallback((stage: Konva.Stage, touches: TouchList) => {
    if (touches.length < 2) return
    const rect = stage.container().getBoundingClientRect()
    const t0 = touches[0]
    const t1 = touches[1]
    const p0 = { x: t0.clientX - rect.left, y: t0.clientY - rect.top }
    const p1 = { x: t1.clientX - rect.left, y: t1.clientY - rect.top }
    lastCenterRef.current = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }
    lastDistRef.current = Math.hypot(p1.x - p0.x, p1.y - p0.y)
  }, [])

  // ピンチ＋パン更新
  const panWithPinchZoom = useCallback(
    (
      stage: Konva.Stage,
      touches: TouchList,
      restrict?: (pos: { x: number; y: number }) => { x: number; y: number }
    ) => {
      if (touches.length < 2) return
      const rect = stage.container().getBoundingClientRect()
      const t0 = touches[0]
      const t1 = touches[1]
      const p0 = { x: t0.clientX - rect.left, y: t0.clientY - rect.top }
      const p1 = { x: t1.clientX - rect.left, y: t1.clientY - rect.top }

      const center = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }
      const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y)

      // 初回の場合は前回のデータを保存
      if (!lastCenterRef.current) {
        lastCenterRef.current = center
        lastDistRef.current = dist
        return
      }

      const lastCenter = lastCenterRef.current
      const lastDist = lastDistRef.current || dist

      // アンカー中心のローカル座標
      const pointTo = {
        x: (center.x - stage.x()) / stage.scaleX(),
        y: (center.y - stage.y()) / stage.scaleX(),
      }

      // スケール更新（距離比）
      const ratio = dist / lastDist
      const nextScale = Math.min(Math.max(stage.scaleX() * ratio, 0.2), 4)
      stage.scale({ x: nextScale, y: nextScale })

      // パン（中心の移動分 + スケールによる補正）
      const dx = center.x - lastCenter.x
      const dy = center.y - lastCenter.y
      const newPos = {
        x: center.x - pointTo.x * nextScale + dx,
        y: center.y - pointTo.y * nextScale + dy,
      }
      stage.position(restrict ? restrict(newPos) : newPos)

      // 次回用に保存
      lastCenterRef.current = center
      lastDistRef.current = dist
    },
    []
  )

  const clearActivePointers = useCallback(() => {
    lastCenterRef.current = null
    lastDistRef.current = 0
  }, [])

  return { startPanWithPinchZoom, panWithPinchZoom, clearActivePointers }
}
