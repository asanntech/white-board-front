import { atom } from 'jotai'
import Konva from 'konva'

export const eraserNodesAtom = atom<Konva.Node>()

export const addPointsToEraserAtom = atom(null, (get, set, points: number[]) => {
  const current = get(eraserNodesAtom)
  if (!current) return

  const prevEraser = current.clone() as Konva.Line
  const newEraser = prevEraser?.points([...prevEraser.points(), ...points])
  set(eraserNodesAtom, newEraser)
})
