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
        const results = undo()
        if (results) emitUndo(results)
      },
      disabled: !canUndo,
    },
    {
      icon: <RedoIcon />,
      id: 'redo',
      onClick: () => {
        const results = redo()
        if (results) emitRedo(results)
      },
      disabled: !canRedo,
    },
  ]

  return (
    <div className="flex gap-2 bg-white rounded-md p-2 shadow-md">
      <IconButton icon={<SelectIcon />} active={tool === 'select'} onClick={() => setTool('select')} />
      <div className="w-[1px] h-auto my-[-8px] bg-gray-200" />
      {tools.map((t) => (
        <IconButton key={t.id} icon={t.icon} active={t.id === tool} onClick={() => setTool(t.id)} />
      ))}
      <div className="w-[1px] h-auto my-[-8px] bg-gray-200" />
      {actions.map((action) => (
        <IconButton key={action.id} icon={action.icon} onClick={action.onClick} disabled={action.disabled} />
      ))}
    </div>
  )
}
