import Image from 'next/image'
interface MainMenuProps {
  signInUrl: string
  onClickFreeTrial: () => void
}

export const MainMenu = ({ signInUrl, onClickFreeTrial }: MainMenuProps) => {
  return (
    <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-120 w-11/12 bg-white text-center rounded-md p-6 shadow-lg">
      <h1 className="text-4xl font-bold text-emerald-500">White Board</h1>
      <div className="mt-4 flex justify-center">
        <Image src="/main.svg" width={100} height={100} alt="white board logo" priority />
      </div>
      <div className="flex flex-col gap-4 mt-5">
        <button
          onClick={onClickFreeTrial}
          className="text-lg text-emerald-500 font-bold rounded-4xl p-2 border border-emerald-500 cursor-pointer"
        >
          Free Trial
        </button>
        <a href={signInUrl} className="bg-emerald-500 text-white text-lg font-bold rounded-4xl p-2 hover:opacity-70">
          Sign In
        </a>
      </div>
    </section>
  )
}
