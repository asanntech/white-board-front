export const canvasSize = 16384

export const whiteboardColors = {
  background: '#F2F2F2',
  gridLine: '#E9E9E9',
  gridLineBold: '#DFDFDF',
}

export const lineConfig = {
  pen: {
    stroke: '#000000',
    strokeWidth: 2,
    tension: 0,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'source-over' as const,
  },
  redPen: {
    stroke: '#fa7d7d',
    strokeWidth: 2,
    tension: 0,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'source-over' as const,
  },
  marker: {
    stroke: '#90EE90',
    strokeWidth: 20,
    tension: 0.5,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'source-over' as const,
    opacity: 0.5,
  },
  eraser: {
    stroke: '#FFFFFF',
    strokeWidth: 50,
    tension: 0.5,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    globalCompositeOperation: 'destination-out' as const,
  },
}
