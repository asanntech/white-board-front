import { SelectIcon, PenToolIcon, TextIcon, ShapeIcon, UndoIcon, RedoIcon } from '../../../components/icons'

export const Toolbar = () => {
  const tools = [
    { icon: <SelectIcon />, id: 'select' },
    { icon: <PenToolIcon />, id: 'penTool' },
    { icon: <TextIcon />, id: 'text' },
    { icon: <ShapeIcon />, id: 'shape' },
  ]

  const actions = [
    { icon: <UndoIcon />, id: 'undo' },
    { icon: <RedoIcon />, id: 'redo' },
  ]

  return (
    <div className="flex flex-col gap-3 bg-white rounded-md p-2 shadow-md">
      {tools.map((tool) => (
        <IconButton key={tool.id} icon={tool.icon} />
      ))}
      <div className="w-full h-[1px] bg-gray-200" />
      {actions.map((action) => (
        <IconButton key={action.id} icon={action.icon} />
      ))}
    </div>
  )
}

const IconButton = ({ icon }: { icon: React.ReactNode }) => {
  return <button className="rounded-md p-2 cursor-pointer hover:bg-blue-50">{icon}</button>
}
