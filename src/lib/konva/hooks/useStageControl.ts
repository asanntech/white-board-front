import { useCallback, useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { KonvaEventObject } from 'konva/lib/Node'
import Konva from 'konva'
import { useScaleAtPointer } from './useScaleAtPointer'
import { useViewportSize } from './useViewportSize'
import { useDrawing } from './useDrawing'
import { useSelectionRange } from './useSelectionRange'
import { useSocketManager } from './useSocketManager'
import { spaceKeyPressAtom, toolAtom, pushToHistoryAtom, removeLineAtom, isReadyCanvasAtom } from '../atoms'
import { canvasSize } from '../constants'
import { Drawing } from '../types'

export const useStageControl = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  const tool = useAtomValue(toolAtom)
  const isSpacePressed = useAtomValue(spaceKeyPressAtom)

  const { width, height } = useViewportSize()

  const { scale, scaleAtPointer } = useScaleAtPointer(stageRef)

  const { lineNodes, eraserNode, isDrawing, isPenMode, startDrawing, continueDrawing, finishDrawing } = useDrawing()

  const { selectionRectRef, selectionRectangle, displaySelectionRect, startSelection, updateSelection, endSelection } =
    useSelectionRange()

  const { emitRemove, emitDrawing, emitTransform } = useSocketManager()

  // ドラッグ範囲をcanvas領域に制限する
  const restrictDragWithinCanvas = useCallback(
    (pos: { x: number; y: number }) => {
      const stage = stageRef.current
      if (!stage) return pos

      // キャンバスの境界を計算
      const minX = width - canvasSize * scale
      const maxX = 0
      const minY = height - canvasSize * scale
      const maxY = 0

      return {
        x: Math.min(Math.max(pos.x, minX), maxX),
        y: Math.min(Math.max(pos.y, minY), maxY),
      }
    },
    [width, height, scale]
  )

  // 選択範囲と交差するLineを抽出する関数
  const getIntersectingLines = useCallback((): Konva.Node[] => {
    if (!selectionRectangle.visible) return []

    const selBox = selectionRectRef.current?.getClientRect()
    if (!selBox) return []

    const intersectingLines = stageRef.current?.find('Line').filter((line) => {
      const lineBox = line.getClientRect()
      return Konva.Util.haveIntersection(lineBox, selBox)
    })
    return intersectingLines ?? []
  }, [selectionRectRef, selectionRectangle.visible])

  const handlePointerDown = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (tool === 'select') {
        startSelection(e)
      } else {
        const newLineNode = startDrawing(e)
        const drawings = newLineNode ? [newLineNode.attrs as Drawing] : []
        if (newLineNode && isPenMode) emitDrawing(drawings)
      }
    },
    [tool, isPenMode, startDrawing, startSelection, emitDrawing]
  )

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (tool === 'select') {
        updateSelection(e)
      } else {
        continueDrawing(e)
      }
    },
    [tool, continueDrawing, updateSelection]
  )

  // 変形ツールを使用しているかどうかを管理
  const transformedStateRef = useRef<boolean>(false)

  const handlePointerUp = useCallback(() => {
    if (tool === 'select') {
      endSelection()

      const transformer = transformerRef.current
      if (!transformer || transformedStateRef.current) {
        transformedStateRef.current = false
        return
      }

      const lines = getIntersectingLines()
      transformer.nodes(lines)
    } else {
      const newLineNode = finishDrawing()
      const drawings = newLineNode ? [newLineNode.attrs as Drawing] : []
      if (newLineNode && isPenMode) emitTransform(drawings)
    }
  }, [tool, emitTransform, isPenMode, finishDrawing, endSelection, getIntersectingLines])

  const changeTransformedState = useCallback(() => {
    transformedStateRef.current = true
  }, [])

  const removeLine = useSetAtom(removeLineAtom)

  const handleLinePointerOver = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (tool === 'eraser' && isDrawing) {
        const id = e.target.attrs.id
        removeLine(id)
        emitRemove([id])
      }
    },
    [tool, isDrawing, emitRemove, removeLine]
  )

  const pushToHistory = useSetAtom(pushToHistoryAtom)

  // 変形ツールに伴うノードの変更を履歴に追加
  const pushTransformToHistory = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      let drawings: Drawing[] = []

      if (!(e.currentTarget instanceof Konva.Transformer)) {
        console.error('not transformer')
        return
      }

      const newNodes = e.currentTarget.nodes().map((n) => n.clone()) as Konva.Line[]
      pushToHistory(newNodes)

      drawings = newNodes.map((n) => n.attrs as Drawing)
      emitTransform(drawings)
    },
    [emitTransform, pushToHistory]
  )

  const setIsReadyCanvas = useSetAtom(isReadyCanvasAtom)

  // 初期状態でカメラを中央に配置（初回のみ）
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const pos = stage.position()
    if (pos.x !== 0 && pos.y !== 0) return

    const centerX = canvasSize / 2
    const centerY = canvasSize / 2

    const viewportCenterX = width / 2
    const viewportCenterY = height / 2

    // 世界座標 (centerX, centerY) をビューポート中心 (viewportCenterX, viewportCenterY) に合わせる
    stage.position({
      x: viewportCenterX - centerX,
      y: viewportCenterY - centerY,
    })

    setIsReadyCanvas(true)
  }, [width, height, setIsReadyCanvas])

  // スペースキー押下中にカーソルを変更
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const container = stage.container()
    container.style.cursor = isSpacePressed ? 'grab' : 'default'
  }, [isSpacePressed])

  // 変形ツールのノードをクリア
  useEffect(() => {
    transformerRef.current?.nodes([])
  }, [lineNodes.length])

  return {
    stageRef,
    width,
    height,
    scale,
    scaleAtPointer,
    restrictDragWithinCanvas,
    lineNodes,
    eraserNode,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isSpacePressed,
    selectionRectRef,
    displaySelectionRect,
    visibleSelectionRect: selectionRectangle.visible,
    handleLinePointerOver,
    transformerRef,
    changeTransformedState,
    pushTransformToHistory,
  }
}
