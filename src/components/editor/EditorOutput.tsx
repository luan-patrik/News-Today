'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)

interface EditorOutputProps {
  content: any
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

const EditorOutput = ({ content }: EditorOutputProps) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderers={renderers}
    />
  )
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-muted rounded-md p-4">
      <code className="text-sm">{data.code}</code>
    </pre>
  )
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  )
}

export default EditorOutput
