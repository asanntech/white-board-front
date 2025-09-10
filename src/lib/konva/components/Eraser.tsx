import { RefObject } from 'react'
import { Circle, Group } from 'react-konva'
import Konva from 'konva'
import { useCanvasCoordinates } from '../hooks'

interface Props {
  stageRef: RefObject<Konva.Stage | null>
  visible?: boolean
}

export const Eraser = ({ stageRef, visible }: Props) => {
  const { getPointerPosition } = useCanvasCoordinates()

  if (!stageRef.current || !visible) return null

  const position = getPointerPosition(stageRef.current)

  return (
    <Group x={position?.x} y={position?.y}>
      <Circle radius={20} stroke="#90caf9" strokeWidth={2} />
      <Circle radius={10} fill="#90caf9" />
    </Group>
  )
}
