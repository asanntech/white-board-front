interface ToastProps {
  showToast: boolean
  toastMessage: string
}

export const Toast = ({ showToast, toastMessage }: ToastProps) => {
  return (
    <div
      aria-live="polite"
      className={`fixed left-1/2 -translate-x-1/2 top-6 z-1 transition-all duration-300 ${
        showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded shadow-md">{toastMessage}</div>
    </div>
  )
}
