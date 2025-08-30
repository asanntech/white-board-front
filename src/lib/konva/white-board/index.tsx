import { Stage, Layer, Circle } from 'react-konva'
import { useRef, useEffect } from 'react'
import Konva from 'konva'
import { useScaleAtPointer, useViewportSize } from '../hooks'
import { COLORS } from '@/shared/constants'

export const WhiteBoard = () => {
  const { width, height } = useViewportSize()

  const stageRef = useRef<Konva.Stage>(null)
  const { scale, scaleAtPointer } = useScaleAtPointer(stageRef)

  // 背景を方眼紙風に描画する
  useEffect(() => {
    if (!stageRef.current) return

    const gridSize = 80 * scale
    const boldSize = gridSize * 5

    const container = stageRef.current.container()
    container.style.backgroundColor = COLORS.WHITEBOARD.BACKGROUND
    container.style.backgroundImage = `
      linear-gradient(to right, ${COLORS.WHITEBOARD.GRID_LINE} 1px, ${COLORS.COMMON.TRANSPARENT} 1px),
      linear-gradient(to bottom, ${COLORS.WHITEBOARD.GRID_LINE} 1px, ${COLORS.COMMON.TRANSPARENT} 1px),
      linear-gradient(to right, ${COLORS.WHITEBOARD.GRID_LINE_BOLD} 1px, ${COLORS.COMMON.TRANSPARENT} 1px),
      linear-gradient(to bottom, ${COLORS.WHITEBOARD.GRID_LINE_BOLD} 1px, ${COLORS.COMMON.TRANSPARENT} 1px)
    `
    container.style.backgroundSize = `
      ${gridSize}px ${gridSize}px,
      ${gridSize}px ${gridSize}px,
      ${boldSize}px ${boldSize}px,
      ${boldSize}px ${boldSize}px
    `
  }, [scale])

  return (
    <Stage ref={stageRef} width={width} height={height} draggable onWheel={scaleAtPointer}>
      <Layer>
        <Circle x={width / 2} y={height / 2} radius={50} fill="green" />
      </Layer>
    </Stage>
  )
}
