import { Stage } from 'react-konva'
import { useRef, useEffect } from 'react'
import Konva from 'konva'
import { useScaleAtPointer, useViewportSize, useKeyboardState } from '../hooks'
import { GraphPaperLayer } from '../components'
import { canvasSize } from '../constants'

export const WhiteBoard = () => {
  const { width, height } = useViewportSize()

  const stageRef = useRef<Konva.Stage>(null)
  const { scale, scaleAtPointer } = useScaleAtPointer(stageRef)

  // スペースキーの押下状態を管理
  const isSpacePressed = useKeyboardState('Space')

  // スペースキー押下中にカーソルを変更
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const container = stage.container()
    container.style.cursor = isSpacePressed ? 'grab' : 'default'
  }, [isSpacePressed])

  // 初期状態でカメラを中央に配置
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    // x=y想定のズーム倍率
    const s = scale
    const centerX = canvasSize / 2
    const centerY = canvasSize / 2

    const viewportCenterX = width / 2
    const viewportCenterY = height / 2

    // 世界座標 (centerX, centerY) をビューポート中心 (viewportCenterX, viewportCenterY) に合わせる
    stage.position({
      x: viewportCenterX - centerX * s,
      y: viewportCenterY - centerY * s,
    })

    stage.batchDraw()
  }, [width, height, scale])

  return (
    <Stage ref={stageRef} width={width} height={height} draggable={isSpacePressed} onWheel={scaleAtPointer}>
      <GraphPaperLayer scale={scale} />
    </Stage>
  )
}
