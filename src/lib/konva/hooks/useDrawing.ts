import { useState, useMemo, useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { KonvaEventObject } from 'konva/lib/Node'
import { produce } from 'immer'
import { useCanvasCoordinates } from './useCanvasCoordinates'
import { toolAtom, spaceKeyPressAtom } from '../atoms'
import { currentDrawingObjectsAtom, pushToHistoryAtom } from '../atoms/undoRedoAtom'
import { DrawingObject } from '../types'

export const useDrawing = () => {
  const tool = useAtomValue(toolAtom)

  const drawingType = useMemo(() => {
    return tool === 'pen' || tool === 'redPen' || tool === 'marker' || tool === 'eraser' ? tool : undefined
  }, [tool])

  const createDrawingObject = useCallback(
    (points: number[]) => {
      if (!drawingType) {
        throw new Error('Tool must be pen, marker, or eraser')
      }

      return {
        id: `${drawingType}-${Date.now()}-${Math.random()}`,
        type: drawingType,
        points,
      }
    },
    [drawingType]
  )

  const [isDrawing, setIsDrawing] = useState(false)

  const isSpacePressed = useAtomValue(spaceKeyPressAtom)

  // 履歴管理のatomを使用
  const lineObjects = useAtomValue(currentDrawingObjectsAtom)
  const pushToHistory = useSetAtom(pushToHistoryAtom)

  // 描画中の一時的な状態を管理
  const [tempLineObjects, setTempLineObjects] = useState<DrawingObject[]>([])

  const { getPointerPosition } = useCanvasCoordinates()

  const handlePointerDown = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (isSpacePressed || !drawingType) return

      const stage = e.target.getStage()
      if (!stage) return

      const canvasPos = getPointerPosition(stage)
      if (!canvasPos) return

      setIsDrawing(true)

      // ツールに応じた描画オブジェクトを作成
      const newObject = createDrawingObject([canvasPos.x, canvasPos.y])

      // 一時的な状態に追加（履歴には追加しない）
      setTempLineObjects([...lineObjects, newObject])
    },
    [isSpacePressed, drawingType, getPointerPosition, createDrawingObject, lineObjects]
  )

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (!isDrawing) return

      const stage = e.target.getStage()
      if (!stage) return

      const canvasPos = getPointerPosition(stage)
      if (!canvasPos) return

      // 一時的な状態を更新（履歴には追加しない）
      setTempLineObjects((prev) =>
        produce(prev, (draft) => {
          const lastObject = draft[draft.length - 1]
          if (lastObject) {
            lastObject.points.push(canvasPos.x, canvasPos.y)
          }
        })
      )
    },
    [getPointerPosition, isDrawing]
  )

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false)

    // 描画完了時に履歴に追加
    if (tempLineObjects.length > 0) {
      pushToHistory(tempLineObjects)
      setTempLineObjects([])
    }
  }, [tempLineObjects, pushToHistory])

  // 描画中は一時的な状態を表示、そうでなければ履歴の状態を表示
  const displayObjects = isDrawing ? tempLineObjects : lineObjects

  return {
    lineObjects: displayObjects,
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
