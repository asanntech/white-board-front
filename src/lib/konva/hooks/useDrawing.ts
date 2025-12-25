import { useState, useMemo, useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Konva from 'konva'
import { useCanvasCoordinates } from './useCanvasCoordinates'
import { toolAtom, spaceKeyPressAtom } from '../atoms'
import { lineNodesAtom } from '../atoms'
import { addDrawingAtom, drawingsAtom } from '@/lib/yjs'
import { lineConfig } from '../constants'
import { Tool, Drawing } from '../types'

// Lineオブジェクトの描画ロジックを管理
export const useDrawing = () => {
  const tool = useAtomValue(toolAtom)

  const drawingType = useMemo(() => {
    return tool === 'pen' || tool === 'redPen' || tool === 'marker' || tool === 'eraser' ? tool : undefined
  }, [tool])

  const isPenMode = useMemo(() => {
    return drawingType === 'pen' || drawingType === 'redPen' || drawingType === 'marker'
  }, [drawingType])

  const isSpacePressed = useAtomValue(spaceKeyPressAtom)

  const displayLineNodes = useAtomValue(lineNodesAtom)
  const addDrawing = useSetAtom(addDrawingAtom)
  const drawings = useAtomValue(drawingsAtom)

  const { getPointerPosition } = useCanvasCoordinates()

  // 一時的なLineオブジェクトを管理
  // 一筆書き後にまとめて履歴に追加するために使用
  const [tempLineNode, setTempLineNode] = useState<Konva.Line | null>(null)

  // 描画を開始する
  const startDrawing = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (isSpacePressed || !drawingType) return

      const stage = e.target.getStage()
      if (!stage) return

      const pointerPos = getPointerPosition(stage)
      if (!pointerPos) return

      const newLineNode = createLineObject(drawingType, [pointerPos.x, pointerPos.y])
      setTempLineNode(newLineNode)

      return newLineNode
    },
    [isSpacePressed, drawingType, getPointerPosition]
  )

  // 描画を継続する
  const continueDrawing = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      const stage = e.target.getStage()
      if (!stage) return

      const pointerPos = getPointerPosition(stage)
      if (!pointerPos) return

      setTempLineNode((prev) => {
        if (!prev) return null
        const newLineNode = prev.clone()
        newLineNode.points([...prev.points(), pointerPos.x, pointerPos.y])
        return newLineNode
      })
    },
    [getPointerPosition]
  )

  // 描画を終了する
  const finishDrawing = useCallback(
    (isPushToHistory = true) => {
      const newLineNode = tempLineNode as Konva.Line
      if (!newLineNode) return

      setTempLineNode(null)

      if (isPenMode && isPushToHistory) {
        // Konva.LineをDrawing型に変換してYjsに追加
        const drawing: Drawing = newLineNode.attrs as Drawing
        addDrawing(drawing)
      }

      return newLineNode
    },
    [isPenMode, tempLineNode, addDrawing]
  )

  // Yjsから取得したdrawingsをKonva.Lineに変換
  const yjsLineNodes = useMemo(() => {
    return drawings.map((drawing) => new Konva.Line({ ...drawing }))
  }, [drawings])

  // 一時的なLineとYjsから取得したLineを結合
  const lineNodes = useMemo(() => {
    const baseNodes = yjsLineNodes.length > 0 ? yjsLineNodes : displayLineNodes
    return tempLineNode && isPenMode ? [...baseNodes, tempLineNode] : baseNodes
  }, [tempLineNode, displayLineNodes, yjsLineNodes, isPenMode])

  const eraserNode = useMemo(() => {
    return tempLineNode && !isPenMode ? tempLineNode : null
  }, [tempLineNode, isPenMode])

  return {
    lineNodes,
    eraserNode,
    isDrawing: !!tempLineNode,
    isPenMode,
    startDrawing,
    continueDrawing,
    finishDrawing,
  }
}

// Lineオブジェクトを作成する関数
function createLineObject(type: Extract<Tool, 'pen' | 'redPen' | 'marker' | 'eraser'>, points: number[]): Konva.Line {
  return new Konva.Line({
    id: `${type}-${Date.now()}-${Math.random()}`,
    type: 'pen',
    points,
    ...lineConfig[type],
  })
}
