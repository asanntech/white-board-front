import { useState, useCallback, useMemo, useRef } from 'react'
import Konva from 'konva'
import { useCanvasCoordinates } from './useCanvasCoordinates'

interface SelectionRectangle {
  visible: boolean
  x1: number
  y1: number
  x2: number
  y2: number
}

// 選択範囲の矩形を管理
export const useSelectionRange = () => {
  const selectionRectRef = useRef<Konva.Rect>(null)

  const { getPointerPosition } = useCanvasCoordinates()

  const [selectionRectangle, setSelectionRectangle] = useState<SelectionRectangle>({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  })

  const startSelection = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      const stage = e.target.getStage()
      if (!stage) return

      const pos = getPointerPosition(stage)
      if (!pos) return

      setSelectionRectangle({
        visible: true,
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y,
      })
    },
    [getPointerPosition]
  )

  const updateSelection = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      const stage = e.target.getStage()
      if (!stage) return

      const pos = getPointerPosition(stage)
      if (!pos) return

      setSelectionRectangle((prev) => ({
        ...prev,
        x2: pos.x,
        y2: pos.y,
      }))
    },
    [getPointerPosition]
  )

  const endSelection = useCallback(() => {
    setSelectionRectangle({
      visible: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    })
  }, [])

  // ユーザー操作時に表示する選択範囲の計算された値
  // selectionRectRefで保持する値と異なる
  const displaySelectionRect = useMemo(
    () => ({
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    }),
    [selectionRectangle.x1, selectionRectangle.y1, selectionRectangle.x2, selectionRectangle.y2]
  )

  return {
    selectionRectRef,
    selectionRectangle,
    displaySelectionRect,
    startSelection,
    updateSelection,
    endSelection,
  }
}
