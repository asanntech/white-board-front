export const canvasSize = 16384

export const whiteboardColors = {
  background: '#F2F2F2',
  gridLine: '#E9E9E9',
  gridLineBold: '#DFDFDF',
  transformer: '#007bff',
  selectionRectangle: '#0000ff4d',
}

export const lineConfig = {
  pen: {
    stroke: '#333333',
    strokeWidth: 4,
    hitStrokeWidth: 24,
    tension: 0,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'source-over' as const,
  },
  redPen: {
    stroke: '#fa7d7d',
    strokeWidth: 4,
    hitStrokeWidth: 24,
    tension: 0,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'source-over' as const,
  },
  marker: {
    stroke: '#90EE90',
    strokeWidth: 10,
    hitStrokeWidth: 28,
    tension: 0.5,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'source-over' as const,
    opacity: 0.5,
  },
  eraser: {
    stroke: '#CCCCCC',
    strokeWidth: 4,
    tension: 0.5,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'xor' as const,
    opacity: 0.5,
    listening: false, // 消しゴムは常に最背面に配置
  },
}
