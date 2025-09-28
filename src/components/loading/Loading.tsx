export const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <section className="mb-8">
          <h2 className={`text-base text-gray-800 mb-2`}>Loading...</h2>
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </section>
        <footer className="text-xs text-gray-400">
          <p>White Board App</p>
        </footer>
      </div>
    </div>
  )
}
