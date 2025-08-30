'use client'

import { useState } from 'react'
import Konva from 'konva'

export const useScaleAtPointer = (stageRef: React.RefObject<Konva.Stage | null>) => {
  const [scale, setScale] = useState(1)

  const scaleAtPointer = (e: Konva.KonvaEventObject<WheelEvent>) => {
    // commandキーまたはctrlキーが押されていない場合はスクロールを許可
    if (!e.evt.ctrlKey && !e.evt.metaKey) {
      return
    }

    const stage = stageRef.current
    if (!stage) return

    // デフォルトのスクロールを防止
    e.evt.preventDefault()

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    if (!pointer) return

    // マウスポインターの位置を現在の拡大率で正規化
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    // マウスホイールの方向を取得
    let direction = e.evt.deltaY > 0 ? 1 : -1

    // トラックパッドで拡大する場合、方向を反転
    if (e.evt.ctrlKey || e.evt.metaKey) {
      direction = -direction
    }

    // 拡大率を計算
    const scaleBy = 1.05
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

    // 拡大率の範囲を0.2から4に制限
    const zoomScaleWithinBounds = Math.min(Math.max(newScale, 0.2), 4)
    stage.scale({ x: zoomScaleWithinBounds, y: zoomScaleWithinBounds })
    setScale(zoomScaleWithinBounds)

    // マウスポインターの位置を更新
    const newPos = {
      x: pointer.x - mousePointTo.x * zoomScaleWithinBounds,
      y: pointer.y - mousePointTo.y * zoomScaleWithinBounds,
    }
    stage.position(newPos)
  }

  return { scale, scaleAtPointer }
}
