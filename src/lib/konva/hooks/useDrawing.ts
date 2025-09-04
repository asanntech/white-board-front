import { useState, useRef, useCallback } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { KonvaEventObject } from 'konva/lib/Node'
import { produce } from 'immer'
import { useCanvasCoordinates } from './useCanvasCoordinates'
import { toolAtom, spaceKeyPressAtom } from '../atoms'
import { Drawing, DrawingObject } from '../types'

export const useDrawing = () => {
  const [tool] = useAtom(toolAtom)
  const isSpacePressed = useAtomValue(spaceKeyPressAtom)

  const [lineObjects, setLineObjects] = useState<DrawingObject[]>([])

  const isDrawing = useRef(false)

  const { getPointerPosition } = useCanvasCoordinates()

  // 各ツールの描画ロジック
  const createDrawingObject = useCallback((tool: Drawing, points: number[]): DrawingObject => {
    return {
      id: `${tool}-${Date.now()}-${Math.random()}`,
      type: tool,
      points,
    }
  }, [])

  const handlePointerDown = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (isSpacePressed) return

      const stage = e.target.getStage()
      if (!stage) return

      const canvasPos = getPointerPosition(stage)
      if (!canvasPos) return

      isDrawing.current = true

      // ツールに応じた描画オブジェクトを作成
      const newObject = createDrawingObject(tool, [canvasPos.x, canvasPos.y])

      setLineObjects(
        produce((draft) => {
          draft.push(newObject)
        })
      )
    },
    [tool, isSpacePressed, getPointerPosition, createDrawingObject]
  )

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (!isDrawing.current) return

      const stage = e.target.getStage()
      if (!stage) return

      const canvasPos = getPointerPosition(stage)
      if (!canvasPos) return

      setLineObjects(
        produce((draft) => {
          const lastObject = draft[draft.length - 1]
          if (lastObject) {
            lastObject.points.push(canvasPos.x, canvasPos.y)
          }
        })
      )
    },
    [getPointerPosition]
  )

  const handlePointerUp = useCallback(() => {
    isDrawing.current = false
  }, [])

  // ツール別の描画設定
  const getDrawingConfig = useCallback((object: DrawingObject) => {
    switch (object.type) {
      case 'pen':
        return {
          stroke: '#000000',
          strokeWidth: 2,
          tension: 0,
          lineCap: 'round' as const,
          lineJoin: 'round' as const,
          globalCompositeOperation: 'source-over' as const,
        }
      case 'brush':
        return {
          stroke: '#df4b26',
          strokeWidth: 5,
          tension: 0.5,
          lineCap: 'round' as const,
          lineJoin: 'round' as const,
          globalCompositeOperation: 'source-over' as const,
        }
      case 'eraser':
        return {
          stroke: '#000000',
          strokeWidth: 10,
          tension: 0.5,
          lineCap: 'round' as const,
          lineJoin: 'round' as const,
          globalCompositeOperation: 'destination-out' as const,
        }
      default:
        return {
          stroke: '#df4b26',
          strokeWidth: 5,
          tension: 0.5,
          lineCap: 'round' as const,
          lineJoin: 'round' as const,
          globalCompositeOperation: 'source-over' as const,
        }
    }
  }, [])

  return {
    lineObjects,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getDrawingConfig,
  }
}
