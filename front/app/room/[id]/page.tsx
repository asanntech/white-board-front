import { signOutAction } from '@/actions/'

export default async function RoomPage() {
  return (
    <div>
      <p>Hello!</p>
      <form action={signOutAction}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}
