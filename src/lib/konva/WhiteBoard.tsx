'use client'

import { Stage, Layer, Line, Rect, Transformer } from 'react-konva'
import { useStageControl, useKeyboardListeners } from './hooks'
import { GraphPaperLayer, Toolbar } from './components'
import { whiteboardColors } from './constants'

export const WhiteBoard = () => {
  const {
    stageRef,
    width,
    height,
    scale,
    scaleAtPointer,
    restrictDragWithinCanvas,
    isSpacePressed,
    lineNodes,
    eraserNode,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    selectionRectRef,
    visibleSelectionRect,
    displaySelectionRect,
    handleLinePointerOver,
    transformerRef,
    changeTransformedState,
    pushTransformToHistory,
  } = useStageControl()

  useKeyboardListeners(transformerRef)

  return (
    <div>
      <div className="fixed z-1 top-1/2 left-5 -translate-y-1/2">
        <Toolbar />
      </div>
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
          {lineNodes.map((node) => (
            <Line {...node.attrs} key={node.attrs.id} onPointerOver={handleLinePointerOver} />
          ))}
          {/** 消しゴム */}
          {<Line {...eraserNode?.attrs} visible={!!eraserNode} />}
          {/** 選択範囲の矩形 */}
          <Rect
            ref={selectionRectRef}
            x={displaySelectionRect.x}
            y={displaySelectionRect.y}
            width={displaySelectionRect.width}
            height={displaySelectionRect.height}
            fill={whiteboardColors.selectionRectangle}
            visible={visibleSelectionRect}
          />
          {/** 変形ツール */}
          <Transformer
            ref={transformerRef}
            borderStroke={whiteboardColors.transformer}
            borderStrokeWidth={2}
            anchorFill={whiteboardColors.transformer}
            anchorStroke={whiteboardColors.transformer}
            anchorSize={8}
            shouldOverdrawWholeArea // 矩形の領域をドラッグ可能にする
            onDragStart={changeTransformedState}
            onDragEnd={pushTransformToHistory}
            onTransform={changeTransformedState}
            onTransformEnd={pushTransformToHistory}
          />
        </Layer>
      </Stage>
    </div>
  )
}
