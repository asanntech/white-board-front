import { useState, useEffect } from 'react'

interface UseMinLoadingTimeParams {
  minTime?: number
}

export const useMinLoadingTime = ({ minTime = 1000 }: UseMinLoadingTimeParams = {}) => {
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true)
    }, minTime)

    return () => clearTimeout(timer)
  }, [minTime])

  return isMinTimeElapsed
}
