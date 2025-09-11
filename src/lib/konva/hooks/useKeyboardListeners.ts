import { useEffect, RefObject } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Konva from 'konva'
import { keyPressStateAtom, undoAtom, redoAtom, canUndoAtom, canRedoAtom, removeLineAtom } from '../atoms'

export const useKeyboardListeners = (transformerRef: RefObject<Konva.Transformer | null>) => {
  const setKeyPressState = useSetAtom(keyPressStateAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)
  const canUndo = useAtomValue(canUndoAtom)
  const canRedo = useAtomValue(canRedoAtom)
  const removeLine = useSetAtom(removeLineAtom)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyPressState((prev) => ({ ...prev, [e.code]: true }))

      // Delete キーで選択中のLineを削除
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const transformer = transformerRef.current
        if (!transformer || transformer.nodes().length === 0) return

        const selectedNodeIds = transformer.nodes().map((node: Konva.Node) => node.id())
        removeLine(selectedNodeIds)
        transformer.nodes([]) // 選択をクリア
      }

      // Undo/Redo ショートカット
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey && canUndo) {
          e.preventDefault()
          undo()
        } else if ((e.key === 'y' || (e.key === 'z' && e.shiftKey)) && canRedo) {
          e.preventDefault()
          redo()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeyPressState((prev) => ({ ...prev, [e.code]: false }))
    }

    const handleBlur = () => {
      setKeyPressState({})
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [setKeyPressState, undo, redo, canUndo, canRedo, removeLine, transformerRef])
}
