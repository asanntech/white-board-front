import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { toolAtom, canUndoAtom, canRedoAtom, undoAtom, redoAtom } from '../atoms'
import { SelectIcon, PenIcon, UndoIcon, RedoIcon, BrushIcon, EraserIcon, RedPenIcon } from '@/components/icons'
import { useSocketManager } from '../hooks/useSocketManager'
import { Tool, Drawing } from '../types'

export const Toolbar = () => {
  const [tool, setTool] = useAtom(toolAtom)
  const canUndo = useAtomValue(canUndoAtom)
  const canRedo = useAtomValue(canRedoAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)

  const { emitUndo, emitRedo } = useSocketManager()

  const tools: { icon: React.ReactNode; id: Tool }[] = [
    { icon: <PenIcon />, id: 'pen' },
    { icon: <RedPenIcon />, id: 'redPen' },
    { icon: <BrushIcon />, id: 'marker' },
    { icon: <EraserIcon />, id: 'eraser' },
  ]

  const actions = [
    {
      icon: <UndoIcon />,
      id: 'undo',
      onClick: () => {
        const ids = undo()
        if (ids) emitUndo(ids)
      },
      disabled: !canUndo,
    },
    {
      icon: <RedoIcon />,
      id: 'redo',
      onClick: () => {
        const nodes = redo()
        const drawings = nodes?.map((node) => node.attrs as Drawing)
        if (drawings) emitRedo(drawings)
      },
      disabled: !canRedo,
    },
  ]

  return (
    <div className="flex flex-col gap-2 bg-white rounded-md p-2 shadow-md">
      <IconButton icon={<SelectIcon />} active={tool === 'select'} onClick={() => setTool('select')} />
      <div className="w-full h-[1px] bg-gray-200" />
      {tools.map((t) => (
        <IconButton key={t.id} icon={t.icon} active={t.id === tool} onClick={() => setTool(t.id)} />
      ))}
      <div className="w-full h-[1px] bg-gray-200" />
      {actions.map((action) => (
        <IconButton key={action.id} icon={action.icon} onClick={action.onClick} disabled={action.disabled} />
      ))}
    </div>
  )
}

const IconButton = ({
  icon,
  active,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
  disabled?: boolean
}) => {
  return (
    <button
      className={`rounded-md p-2 ${active ? 'bg-neutral-100' : ''} ${
        disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-100'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  )
}
