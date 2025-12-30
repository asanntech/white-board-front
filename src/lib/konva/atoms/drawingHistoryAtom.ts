import { atom } from 'jotai'
import Konva from 'konva'
import { yDocAtom, yDrawingsAtom } from './yjsAtom'
import { Drawing } from '../types'

// Y.Mapの変更をJotaiに通知するためのトリガー
// インクリメントすることでlineNodesAtom等の派生Atomを再計算させる
export const yMapVersionAtom = atom(0)

export const lineNodesAtom = atom<Konva.Line[]>((get) => {
  get(yMapVersionAtom)

  const yDrawings = get(yDrawingsAtom)
  const lines: Konva.Line[] = []

  yDrawings.forEach((drawing, id) => {
    lines.push(new Konva.Line({ ...drawing, id }))
  })

  return lines
})

export const addDrawingAtom = atom(null, (get, _, drawing: Drawing) => {
  const yDrawings = get(yDrawingsAtom)
  const yDoc = get(yDocAtom)

  yDoc.transact(() => {
    yDrawings.set(drawing.id, drawing)
  }, 'local')
})

export const addDrawingsAtom = atom(null, (get, _, drawings: Drawing[]) => {
  const yDrawings = get(yDrawingsAtom)
  const yDoc = get(yDocAtom)

  yDoc.transact(() => {
    drawings.forEach((drawing) => {
      yDrawings.set(drawing.id, drawing)
    })
  }, 'local')
})

export const removeDrawingAtom = atom(null, (get, _, ids: string | string[]) => {
  const yDrawings = get(yDrawingsAtom)
  const yDoc = get(yDocAtom)
  const idsArray = Array.isArray(ids) ? ids : [ids]

  yDoc.transact(() => {
    idsArray.forEach((id) => {
      yDrawings.delete(id)
    })
  }, 'local')
})

export const updateDrawingAtom = atom(null, (get, _, drawings: Drawing | Drawing[]) => {
  const yDrawings = get(yDrawingsAtom)
  const yDoc = get(yDocAtom)
  const drawingsArray = Array.isArray(drawings) ? drawings : [drawings]

  yDoc.transact(() => {
    drawingsArray.forEach((drawing) => {
      yDrawings.set(drawing.id, drawing)
    })
  }, 'local')
})
