import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { toolAtom, undoManagerAtom, undoAtom, redoAtom } from '../atoms'
import { SelectIcon, PenIcon, UndoIcon, RedoIcon, BrushIcon, EraserIcon, RedPenIcon } from '@/components/icons'
import { Tool } from '../types'
import { IconButton } from '@/components/button'

export const Toolbar = () => {
  const [tool, setTool] = useAtom(toolAtom)
  const undoManager = useAtomValue(undoManagerAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)

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
      onClick: () => undo(),
      disabled: !undoManager.undoStack.length,
    },
    {
      icon: <RedoIcon />,
      id: 'redo',
      onClick: () => redo(),
      disabled: !undoManager.redoStack.length,
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
