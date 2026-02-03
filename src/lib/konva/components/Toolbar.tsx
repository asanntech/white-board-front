import { useKonvaStore, selectCanUndo, selectCanRedo } from '@/stores/konva'
import { SelectIcon, PenIcon, UndoIcon, RedoIcon, BrushIcon, EraserIcon, RedPenIcon } from '@/components/icons'
import { useSocketManager } from '../hooks/useSocketManager'
import { Tool } from '../types'
import { IconButton } from '@/components/button'

export const Toolbar = () => {
  const tool = useKonvaStore((s) => s.tool)
  const setTool = useKonvaStore((s) => s.setTool)
  const canUndo = useKonvaStore(selectCanUndo)
  const canRedo = useKonvaStore(selectCanRedo)
  const undo = useKonvaStore((s) => s.undo)
  const redo = useKonvaStore((s) => s.redo)

  const { emitUndo, emitRedo } = useSocketManager()

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
      onClick: () => {
        const results = undo()
        if (results) emitUndo(results)
      },
      disabled: !canUndo,
    },
    {
      icon: <RedoIcon />,
      id: 'redo',
      ariaLabel: 'Redo',
      onClick: () => {
        const results = redo()
        if (results) emitRedo(results)
      },
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
