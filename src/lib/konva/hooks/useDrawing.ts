import { useState, useMemo, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { KonvaEventObject } from 'konva/lib/Node'
import { produce } from 'immer'
import { useCanvasCoordinates } from './useCanvasCoordinates'
import { toolAtom, spaceKeyPressAtom } from '../atoms'
import { DrawingObject } from '../types'

export const useDrawing = () => {
  const tool = useAtomValue(toolAtom)

  const drawingType = useMemo(() => {
    return tool === 'pen' || tool === 'marker' || tool === 'eraser' ? tool : undefined
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

  const [lineObjects, setLineObjects] = useState<DrawingObject[]>([])

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

      setLineObjects(
        produce((draft) => {
          draft.push(newObject)
        })
      )
    },
    [isSpacePressed, drawingType, getPointerPosition, createDrawingObject]
  )

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (!isDrawing) return

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
    [getPointerPosition, isDrawing]
  )

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false)
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
      case 'marker':
        return {
          stroke: '#df4b26',
          strokeWidth: 20,
          tension: 0.5,
          lineCap: 'round' as const,
          lineJoin: 'round' as const,
          globalCompositeOperation: 'source-over' as const,
          opacity: 0.5,
        }
      case 'eraser':
        return {
          stroke: '#000000',
          strokeWidth: 50,
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
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getDrawingConfig,
  }
}
