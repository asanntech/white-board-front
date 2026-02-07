import { useEffect, RefObject } from 'react'
import Konva from 'konva'
import { useWhiteboardStore, selectCanUndo, selectCanRedo } from '../stores'
import { useSocketManager } from './useSocketManager'
import { Drawing } from '../types'

export const useKeyboardListeners = (transformerRef: RefObject<Konva.Transformer | null>) => {
  const setKeyPress = useWhiteboardStore((s) => s.setKeyPress)
  const clearKeyPressState = useWhiteboardStore((s) => s.clearKeyPressState)
  const undo = useWhiteboardStore((s) => s.undo)
  const redo = useWhiteboardStore((s) => s.redo)
  const canUndo = useWhiteboardStore(selectCanUndo)
  const canRedo = useWhiteboardStore(selectCanRedo)
  const removeLine = useWhiteboardStore((s) => s.removeLine)

  const { emitRemove, emitUndo, emitRedo } = useSocketManager()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyPress(e.code, true)

      // Delete キーで選択中のLineを削除
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const transformer = transformerRef.current
        if (!transformer || transformer.nodes().length === 0) return

        const selectedNodes = transformer.nodes().map((node: Konva.Node) => node.attrs as Drawing)
        const selectedNodeIds = selectedNodes.map((node) => node.id)

        removeLine(selectedNodeIds)
        transformer.nodes([]) // 選択をクリア
        emitRemove(selectedNodes)
      }

      // Undo/Redo ショートカット
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey && canUndo) {
          e.preventDefault()
          const results = undo()
          if (results) emitUndo(results)
        } else if ((e.key === 'y' || (e.key === 'z' && e.shiftKey)) && canRedo) {
          e.preventDefault()
          const results = redo()
          if (results) emitRedo(results)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeyPress(e.code, false)
    }

    const handleBlur = () => {
      clearKeyPressState()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [setKeyPress, clearKeyPressState, undo, redo, canUndo, canRedo, removeLine, transformerRef, emitRemove, emitUndo, emitRedo])
}
