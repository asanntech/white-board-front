import { useState, useEffect } from 'react'

interface UseKeyboardStateOptions {
  preventDefault?: boolean
  preventRepeat?: boolean
}

export const useKeyboardState = (targetKey: string, options: UseKeyboardStateOptions = {}) => {
  const [isPressed, setIsPressed] = useState(false)

  const { preventDefault = true, preventRepeat = true } = options

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === targetKey && (!preventRepeat || !e.repeat)) {
        if (preventDefault) {
          e.preventDefault()
        }
        setIsPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === targetKey) {
        setIsPressed(false)
      }
    }

    const handleBlur = () => {
      setIsPressed(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [targetKey, preventDefault, preventRepeat])

  return isPressed
}

// 複数のキーを同時に管理するhooks
// export const useMultiKeyboardState = (keyMap: Record<string, UseKeyboardStateOptions> = {}) => {
//   const [keyStates, setKeyStates] = useState<Record<string, boolean>>({})

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       const key = e.code
//       const options = keyMap[key]

//       if (options && (!options.preventRepeat || !e.repeat)) {
//         if (options.preventDefault !== false) {
//           e.preventDefault()
//         }
//         setKeyStates((prev) => ({ ...prev, [key]: true }))
//       }
//     }

//     const handleKeyUp = (e: KeyboardEvent) => {
//       const key = e.code
//       if (keyMap[key]) {
//         setKeyStates((prev) => ({ ...prev, [key]: false }))
//       }
//     }

//     const handleBlur = () => {
//       setKeyStates({})
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     window.addEventListener('keyup', handleKeyUp)
//     window.addEventListener('blur', handleBlur)

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown)
//       window.removeEventListener('keyup', handleKeyUp)
//       window.removeEventListener('blur', handleBlur)
//     }
//   }, [keyMap])

//   return { keyStates }
// }
