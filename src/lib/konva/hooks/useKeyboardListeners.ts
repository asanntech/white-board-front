import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { keyPressStateAtom } from '../atoms'
import { undoAtom, redoAtom, canUndoAtom, canRedoAtom } from '../atoms/undoRedoAtom'

export const useKeyboardListeners = () => {
  const setKeyPressState = useSetAtom(keyPressStateAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)
  const canUndo = useAtomValue(canUndoAtom)
  const canRedo = useAtomValue(canRedoAtom)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyPressState((prev) => ({ ...prev, [e.code]: true }))

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
  }, [setKeyPressState, undo, redo, canUndo, canRedo])
}
