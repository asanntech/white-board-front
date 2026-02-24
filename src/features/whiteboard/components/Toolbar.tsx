import { useWhiteboardStore, selectCanYjsUndo, selectCanYjsRedo } from '../stores'
import { SelectIcon, PenIcon, UndoIcon, RedoIcon, BrushIcon, EraserIcon, RedPenIcon } from '@/components/icons'
import { Tool } from '../types'
import { IconButton } from '@/components/button'

export const Toolbar = () => {
  const tool = useWhiteboardStore((s) => s.tool)
  const setTool = useWhiteboardStore((s) => s.setTool)
  const canUndo = useWhiteboardStore(selectCanYjsUndo)
  const canRedo = useWhiteboardStore(selectCanYjsRedo)
  const yjsUndo = useWhiteboardStore((s) => s.yjsUndo)
  const yjsRedo = useWhiteboardStore((s) => s.yjsRedo)

  const tools: { icon: React.ReactNode; id: Tool; ariaLabel: string }[] = [
    { icon: <PenIcon />, id: 'pen', ariaLabel: 'Pen' },
    { icon: <RedPenIcon />, id: 'redPen', ariaLabel: 'Red pen' },
    { icon: <BrushIcon />, id: 'marker', ariaLabel: 'Marker' },
    { icon: <EraserIcon />, id: 'eraser', ariaLabel: 'Eraser' },
  ]

  const actions = [
    {
      icon: <UndoIcon />,
      id: 'undo',
      ariaLabel: 'Undo',
      onClick: () => yjsUndo(),
      disabled: !canUndo,
    },
    {
      icon: <RedoIcon />,
      id: 'redo',
      ariaLabel: 'Redo',
      onClick: () => yjsRedo(),
      disabled: !canRedo,
    },
  ]

  return (
    <div className="flex gap-2 bg-white rounded-md p-2 shadow-md">
      <IconButton icon={<SelectIcon />} active={tool === 'select'} onClick={() => setTool('select')} ariaLabel="Select" />
      <div className="w-[1px] h-auto my-[-8px] bg-gray-200" />
      {tools.map((t) => (
        <IconButton key={t.id} icon={t.icon} active={t.id === tool} onClick={() => setTool(t.id)} ariaLabel={t.ariaLabel} />
      ))}
      <div className="w-[1px] h-auto my-[-8px] bg-gray-200" />
      {actions.map((action) => (
        <IconButton key={action.id} icon={action.icon} onClick={action.onClick} disabled={action.disabled} ariaLabel={action.ariaLabel} />
      ))}
    </div>
  )
}
