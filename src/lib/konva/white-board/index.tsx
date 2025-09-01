import { Stage } from 'react-konva'
import { useEffect } from 'react'
import { useViewportSize, useKeyboardState, useStageControl } from '../hooks'
import { GraphPaperLayer } from '../components'

export const WhiteBoard = () => {
  const { width, height } = useViewportSize()

  const { stageRef, scale, scaleAtPointer, restrictDragWithinCanvas } = useStageControl({ width, height })

  // スペースキーの押下状態を管理
  const isSpacePressed = useKeyboardState('Space')

  // スペースキー押下中にカーソルを変更
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const container = stage.container()
    container.style.cursor = isSpacePressed ? 'grab' : 'default'
  }, [stageRef, isSpacePressed])

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      draggable={isSpacePressed}
      dragBoundFunc={restrictDragWithinCanvas}
      onWheel={scaleAtPointer}
    >
      <GraphPaperLayer scale={scale} />
    </Stage>
  )
}
