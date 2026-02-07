import { useCallback } from 'react'
import Konva from 'konva'

export const useCanvasCoordinates = () => {
  // ポインターの位置をキャンバスの座標に変換
  const getPointerPosition = useCallback((stage: Konva.Stage) => {
    const pointerPos = stage.getPointerPosition()
    if (!pointerPos) return

    const canvasPos = stage.getAbsolutePosition()
    const scale = stage.scaleX()

    return {
      x: (pointerPos.x - canvasPos.x) / scale,
      y: (pointerPos.y - canvasPos.y) / scale,
    }
  }, [])

  return { getPointerPosition }
}
