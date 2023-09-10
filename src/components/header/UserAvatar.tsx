'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarProps } from '@radix-ui/react-avatar'
import { User } from 'next-auth'
import Image from 'next/image'
import { Icons } from '@/components/Icons'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image'>
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full">
          <Image
            fill
            src={user.image}
            alt="Foto de perfil"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <Icons.user className="h-4 w-4 text-foreground" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
