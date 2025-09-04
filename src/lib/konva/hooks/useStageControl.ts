import { useCallback, useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import Konva from 'konva'
import { useScaleAtPointer } from './useScaleAtPointer'
import { useViewportSize } from './useViewportSize'
import { spaceKeyPressAtom } from '../atoms'
import { canvasSize } from '../constants'

export const useStageControl = () => {
  const stageRef = useRef<Konva.Stage>(null)

  const isSpacePressed = useAtomValue(spaceKeyPressAtom)

  const { width, height } = useViewportSize()
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

  // 初期状態でカメラを中央に配置（初回のみ）
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const centerX = canvasSize / 2
    const centerY = canvasSize / 2

    const viewportCenterX = width / 2
    const viewportCenterY = height / 2

    // 世界座標 (centerX, centerY) をビューポート中心 (viewportCenterX, viewportCenterY) に合わせる
    stage.position({
      x: viewportCenterX - centerX,
      y: viewportCenterY - centerY,
    })

    stage.batchDraw()
  }, [width, height])

  // スペースキー押下中にカーソルを変更
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const container = stage.container()
    container.style.cursor = isSpacePressed ? 'grab' : 'default'
  }, [isSpacePressed])

  return {
    stageRef,
    width,
    height,
    scale,
    scaleAtPointer,
    restrictDragWithinCanvas,
    isSpacePressed,
  }
}
