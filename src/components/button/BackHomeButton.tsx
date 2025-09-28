export const BackHomeButton = () => {
  return (
    <button
      className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-2xl cursor-pointer hover:opacity-70 transition-opacity shadow-lg"
      onClick={() => {
        window.location.href = '/'
      }}
    >
      ホームに戻る
    </button>
  )
}
