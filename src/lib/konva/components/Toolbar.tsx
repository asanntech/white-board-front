import { useAtom } from 'jotai'
import { toolAtom } from '../atoms'
import { SelectIcon, PenIcon, UndoIcon, RedoIcon, BrushIcon, EraserIcon } from '@/components/icons'
import { Tool } from '../types'

export const Toolbar = () => {
  const [tool, setTool] = useAtom(toolAtom)

  const tools: { icon: React.ReactNode; id: Tool }[] = [
    { icon: <SelectIcon />, id: 'select' },
    { icon: <PenIcon />, id: 'pen' },
    { icon: <BrushIcon />, id: 'marker' },
    { icon: <EraserIcon />, id: 'eraser' },
  ]

  const actions = [
    { icon: <UndoIcon />, id: 'undo' },
    { icon: <RedoIcon />, id: 'redo' },
  ]

  return (
    <div className="flex flex-col gap-2 bg-white rounded-md p-2 shadow-md">
      {tools.map((t) => (
        <IconButton key={t.id} icon={t.icon} active={t.id === tool} onClick={() => setTool(t.id)} />
      ))}
      <div className="w-full h-[1px] bg-gray-200" />
      {actions.map((action) => (
        <IconButton key={action.id} icon={action.icon} />
      ))}
    </div>
  )
}

const IconButton = ({ icon, active, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) => {
  return (
    <button
      className={`rounded-md p-2 cursor-pointer hover:bg-blue-50 ${active ? 'bg-blue-50' : ''}`}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
