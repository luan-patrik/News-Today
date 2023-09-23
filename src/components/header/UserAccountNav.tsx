'use client'

import React from 'react'
import { User } from 'next-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import UserAvatar from './UserAvatar'
import Themes from '../Themes'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'image'>
}

export const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Menu">
        <UserAvatar
          user={{ image: user.image || null }}
          className="h-8 w-8 ring-2 ring-foreground ring-offset-background"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/${session?.user.username}`}>
            {session?.user.username}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/publicar'}>Publicar novo conteúdo</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${session?.user.username}`}>Meus conteúdos</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={''}>Editar perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Themes />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-semibold text-red-500 focus:text-red-500"
          onClick={(e) => {
            e.preventDefault()
            localStorage.clear()
            signOut({ redirect: true, callbackUrl: '/' })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
