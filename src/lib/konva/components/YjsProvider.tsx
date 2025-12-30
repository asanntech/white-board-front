'use client'

import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { yDrawingsAtom } from '../atoms/yjsAtom'
import { yMapVersionAtom } from '../atoms/drawingHistoryAtom'

// Yjsの全ての変更（ローカル・リモート）を検知し、Jotaiに通知するProvider
// YjsはJotaiの外部で状態管理されているため、このProviderがブリッジとなり
// yMapVersionAtomを更新することでReactコンポーネントに反映させる
export const YjsProvider = ({ children }: { children: React.ReactNode }) => {
  const yDrawings = useAtomValue(yDrawingsAtom)
  const setYMapVersion = useSetAtom(yMapVersionAtom)

  useEffect(() => {
    const observer = () => {
      setYMapVersion((v) => v + 1)
    }

    yDrawings.observe(observer)

    return () => {
      yDrawings.unobserve(observer)
    }
  }, [yDrawings, setYMapVersion])

  return <>{children}</>
}
