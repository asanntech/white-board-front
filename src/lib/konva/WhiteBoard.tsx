import { Stage, Layer, Line } from 'react-konva'
import { useStageControl, useDrawing, useKeyboardListeners } from './hooks'
import { Toolbar, GraphPaperLayer } from './components'

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
  const { lineObjects, handlePointerDown, handlePointerMove, handlePointerUp, getDrawingConfig } = useDrawing()

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
          const config = getDrawingConfig(object)
          return <Line key={object.id} points={object.points} {...config} />
        })}
      </Layer>
    </Stage>
  )
}
