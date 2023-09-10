import React from 'react'
import PostFeed from '@/components/PostFeed'

interface PageProps {
  params: {
    page: string
  }
}

export default function Pagina({ params }: PageProps) {
  const { page } = params

  return <PostFeed numberPage={page} />
}
