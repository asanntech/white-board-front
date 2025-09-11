import { useState, useMemo, useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Konva from 'konva'
import { useCanvasCoordinates } from './useCanvasCoordinates'
import { toolAtom, spaceKeyPressAtom } from '../atoms'
import { lineNodesAtom, pushToHistoryAtom, addPointsToLineAtom, eraserNodesAtom, addPointsToEraserAtom } from '../atoms'
import { lineConfig } from '../constants'
import { Tool } from '../types'

// Lineオブジェクトの描画ロジックを管理
export const useDrawing = () => {
  const tool = useAtomValue(toolAtom)

  const drawingType = useMemo(() => {
    return tool === 'pen' || tool === 'redPen' || tool === 'marker' || tool === 'eraser' ? tool : undefined
  }, [tool])

  const [isDrawing, setIsDrawing] = useState(false)

  const isSpacePressed = useAtomValue(spaceKeyPressAtom)

  const lineNodes = useAtomValue(lineNodesAtom)
  const pushToHistory = useSetAtom(pushToHistoryAtom)
  const addPointsToLine = useSetAtom(addPointsToLineAtom)

  const setEraserNodes = useSetAtom(eraserNodesAtom)
  const addPointsToEraser = useSetAtom(addPointsToEraserAtom)

  const { getPointerPosition } = useCanvasCoordinates()

  // 新しいLineオブジェクトのIDを管理
  const newObjectIdRef = useRef('')

  const startDrawing = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (isSpacePressed || !drawingType) return

      const stage = e.target.getStage()
      if (!stage) return

      const pointerPos = getPointerPosition(stage)
      if (!pointerPos) return

      setIsDrawing(true)

      const newLineNode = createLineObject(drawingType, [pointerPos.x, pointerPos.y])

      if (drawingType === 'eraser') {
        setEraserNodes(newLineNode)
      } else {
        pushToHistory(newLineNode)
      }

      newObjectIdRef.current = newLineNode.id()
    },
    [isSpacePressed, drawingType, getPointerPosition, pushToHistory, setEraserNodes]
  )

  const continueDrawing = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (!isDrawing) return

      const stage = e.target.getStage()
      if (!stage) return

      const pointerPos = getPointerPosition(stage)
      if (!pointerPos) return

      if (drawingType === 'eraser') {
        addPointsToEraser([pointerPos.x, pointerPos.y])
      } else {
        addPointsToLine(newObjectIdRef.current, [pointerPos.x, pointerPos.y])
      }
    },
    [isDrawing, drawingType, addPointsToLine, addPointsToEraser, getPointerPosition]
  )

  const finishDrawing = useCallback(() => {
    setIsDrawing(false)

    if (drawingType === 'eraser') {
      setEraserNodes(undefined)
    }

    newObjectIdRef.current = ''
  }, [drawingType, setEraserNodes])

  return {
    lineNodes,
    isDrawing,
    startDrawing,
    continueDrawing,
    finishDrawing,
  }
}

// Lineオブジェクトを作成する関数
function createLineObject(type: Extract<Tool, 'pen' | 'redPen' | 'marker' | 'eraser'>, points: number[]): Konva.Line {
  return new Konva.Line({
    id: `${type}-${Date.now()}`,
    type: 'pen',
    points,
    ...lineConfig[type],
  })
}
