import { useCallback, useEffect, useRef } from 'react'
import Konva from 'konva'
import { useScaleAtPointer } from './useScaleAtPointer'
import { canvasSize } from '../constants'

interface UseStageControlOptions {
  width: number
  height: number
}

export const useStageControl = ({ width, height }: UseStageControlOptions) => {
  const stageRef = useRef<Konva.Stage>(null)

  const { scale, scaleAtPointer } = useScaleAtPointer(stageRef)

  // ドラッグ範囲をcanvas領域に制限する
  const restrictDragWithinCanvas = useCallback(
    (pos: { x: number; y: number }) => {
      const stage = stageRef.current
      if (!stage) return pos

      // キャンバスの境界を計算
      const minX = width - canvasSize * scale
      const maxX = 0
      const minY = height - canvasSize * scale
      const maxY = 0

      return {
        x: Math.min(Math.max(pos.x, minX), maxX),
        y: Math.min(Math.max(pos.y, minY), maxY),
      }
    },
    [width, height, scale]
  )

  // 初期状態でカメラを中央に配置
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const centerX = canvasSize / 2
    const centerY = canvasSize / 2

    const viewportCenterX = width / 2
    const viewportCenterY = height / 2

    // 世界座標 (centerX, centerY) をビューポート中心 (viewportCenterX, viewportCenterY) に合わせる
    stage.position({
      x: viewportCenterX - centerX * scale,
      y: viewportCenterY - centerY * scale,
    })

    stage.batchDraw()
  }, [width, height, scale])

  return {
    stageRef,
    scale,
    scaleAtPointer,
    restrictDragWithinCanvas,
  }
}
