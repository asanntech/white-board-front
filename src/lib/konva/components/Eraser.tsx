import { RefObject } from 'react'
import { Circle, Group } from 'react-konva'
import Konva from 'konva'
import { useCanvasCoordinates } from '../hooks'

interface Props {
  stageRef: RefObject<Konva.Stage | null>
}

export const Eraser = ({ stageRef }: Props) => {
  const { getPointerPosition } = useCanvasCoordinates()
  const position = stageRef.current && getPointerPosition(stageRef.current)

  return (
    <Group x={position?.x} y={position?.y}>
      <Circle radius={20} stroke="#90caf9" strokeWidth={2} />
      <Circle radius={10} fill="#90caf9" />
    </Group>
  )
}
