import Link from 'next/link'
import { UserAccountNav } from './UserAccountNav'
import { getSession } from '@/actions/getCurrentUser'
import Themes from '../Themes'

const Navbar = async () => {
  const session = await getSession()

  return (
    <div className="inset-x-0 h-fit py-2 border-b shadow-sm bg-inherit z-10">
      <div className="container h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center">
          Return
        </Link>

        {session?.user ? (
          <UserAccountNav user={session?.user} />
        ) : (
          <div className="text-sm font-semibold flex gap-4">
            <Link
              href="/sign-in"
              className="transition hover:text-neutral-500 dark:hover:dark:text-neutral-400"
            >
              Entrar
            </Link>
            <Link
              href="/sign-up"
              className="transition hover:text-neutral-500 dark:hover:dark:text-neutral-400 hidden sm:block"
            >
              Cadastrar
            </Link>
            <Themes />
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
