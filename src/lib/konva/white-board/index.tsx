import { Stage } from 'react-konva'
import { useRef, useEffect } from 'react'
import Konva from 'konva'
import { useScaleAtPointer, useViewportSize } from '../hooks'
import { GraphPaperLayer } from '../components'
import { canvasSize } from '../constants'

export const WhiteBoard = () => {
  const { width, height } = useViewportSize()

  const stageRef = useRef<Konva.Stage>(null)
  const { scale, scaleAtPointer } = useScaleAtPointer(stageRef)

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
    <Stage ref={stageRef} width={width} height={height} draggable onWheel={scaleAtPointer}>
      <GraphPaperLayer scale={scale} />
    </Stage>
  )
}
