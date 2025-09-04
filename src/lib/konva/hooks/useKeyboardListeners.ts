import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { keyPressStateAtom } from '../atoms'

export const useKeyboardListeners = () => {
  const setKeyPressState = useSetAtom(keyPressStateAtom)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyPressState((prev) => ({ ...prev, [e.code]: true }))
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
  }, [setKeyPressState])
}
