import { Layer, Rect } from 'react-konva'
import { useState, useMemo } from 'react'
import { canvasSize, whiteboardColors } from '../constants'

interface Props {
  scale: number
}

export const GraphPaperLayer = ({ scale }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  // 方眼紙風の背景画像を生成
  const gridPattern = useMemo(() => {
    // 薄線の間隔
    const gridSize = 80 * scale
    // 太線の間隔
    const boldSize = gridSize * 5

    // パターンのキャンバスは太線間隔に合わせる
    const size = boldSize
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = whiteboardColors.background
    ctx.fillRect(0, 0, size, size)

    // 薄いグリッド線
    ctx.strokeStyle = whiteboardColors.gridLine
    ctx.lineWidth = 1
    for (let x = 0; x <= size; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, size)
      ctx.stroke()
    }
    for (let y = 0; y <= size; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(size, y + 0.5)
      ctx.stroke()
    }

    // 太いグリッド線（5マスごと）
    ctx.strokeStyle = whiteboardColors.gridLineBold
    ctx.lineWidth = 2
    for (let x = 0; x <= size; x += boldSize) {
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, size)
      ctx.stroke()
    }
    for (let y = 0; y <= size; y += boldSize) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(size, y + 0.5)
      ctx.stroke()
    }

    // キャンバスから画像を生成
    const image = new Image()
    image.src = canvas.toDataURL()
    image.onload = () => {
      setImageLoaded(true)
    }

    return image
  }, [scale])

  return (
    <Layer>
      {imageLoaded && (
        <Rect
          x={0}
          y={0}
          width={canvasSize}
          height={canvasSize}
          fillPatternImage={gridPattern}
          fillPatternRepeat="repeat"
        />
      )}
    </Layer>
  )
}
