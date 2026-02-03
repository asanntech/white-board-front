import { twJoin } from 'tailwind-merge'

interface IconButtonProps {
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
}

export const IconButton = ({ icon, active, onClick, disabled = false, ariaLabel }: IconButtonProps) => {
  return (
    <button
      aria-label={ariaLabel}
      className={twJoin(
        'rounded-md p-2',
        active ? 'bg-neutral-100' : '',
        disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-100'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  )
}
