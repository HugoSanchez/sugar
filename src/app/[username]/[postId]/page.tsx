'use client'

import Editor from '../../../components/Editor'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tiptap Editor Demo</h1>
      <Editor />
    </div>
  )
}
