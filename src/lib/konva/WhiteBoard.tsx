import { Stage, Layer, Line } from 'react-konva'
import { useAtomValue } from 'jotai'
import { toolAtom } from './atoms'
import { useStageControl, useDrawing, useKeyboardListeners } from './hooks'
import { Toolbar, GraphPaperLayer, Eraser } from './components'
import { lineConfig } from './constants'

export const WhiteBoard = () => {
  return (
    <div className="relative">
      {/* <a href={signInUrl}>Sign in with Cognito</a> */}
      <div className="fixed z-10 top-1/2 left-5 -translate-y-1/2">
        <Toolbar />
      </div>
      <DrawingArea />
    </div>
  )
}

const DrawingArea = () => {
  const { stageRef, width, height, scale, scaleAtPointer, restrictDragWithinCanvas, isSpacePressed } = useStageControl()
  const { lineObjects, isDrawing, handlePointerDown, handlePointerMove, handlePointerUp } = useDrawing()

  const tool = useAtomValue(toolAtom)
  const showEraser = tool === 'eraser' && isDrawing

  useKeyboardListeners()

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      draggable={isSpacePressed}
      dragBoundFunc={restrictDragWithinCanvas}
      onWheel={scaleAtPointer}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <GraphPaperLayer scale={scale} />
      <Layer>
        {lineObjects.map((object) => {
          const config = lineConfig[object.type]
          return <Line key={object.id} name={object.type} points={object.points} {...config} />
        })}
        {showEraser && <Eraser stageRef={stageRef} />}
      </Layer>
    </Stage>
  )
}
