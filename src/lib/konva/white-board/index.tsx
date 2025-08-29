import React from 'react'
import Konva from 'konva'
import { Stage, Layer, Line } from 'react-konva'

export const WhiteBoard = () => {
  const [tool, setTool] = React.useState('brush')
  const [lines, setLines] = React.useState<{ tool: string; points: number[] }[]>([])
  const isDrawing = React.useRef(false)

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true
    const pos = e.target.getStage()?.getPointerPosition()
    if (pos) {
      setLines([...lines, { tool, points: [pos.x, pos.y] }])
    }
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return
    }
    const stage = e.target.getStage()
    const point = stage?.getPointerPosition()
    if (!point) {
      return
    }

    // To draw line
    let lastLine = lines[lines.length - 1]
    // add point
    if (lastLine) {
      lastLine.points = lastLine.points.concat([point.x, point.y])
    }

    // replace last
    lines.splice(lines.length - 1, 1, lastLine)
    setLines(lines.concat())
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  return (
    <>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value)
        }}
      >
        <option value="brush">Brush</option>
        <option value="eraser">Eraser</option>
      </select>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 25}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        // onTouchStart={handleMouseDown}
        // onTouchMove={handleMouseMove}
        // onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
            />
          ))}
        </Layer>
      </Stage>
    </>
  )
}
