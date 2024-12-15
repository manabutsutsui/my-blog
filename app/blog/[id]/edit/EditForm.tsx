'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import type { Post } from '../../../lib/types'
import Loading from '../../../components/Loading'
import ErrorMessage from '../../../components/ErrorMessage'
import Toast from '../../../components/Toast'

type Props = {
  post: Post
}

export default function EditForm({ post }: Props) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          title, 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', post.id)

      if (updateError) throw updateError

      setShowToast(true)
      setTimeout(() => {
        router.push(`/blog/${post.id}`)
        router.refresh()
      }, 1000)
    } catch (err) {
      setError('記事の更新中にエラーが発生しました。')
      console.error('Error updating post:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">記事の編集</h1>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            本文
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '更新中...' : '更新する'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50"
            disabled={isLoading}
          >
            キャンセル
          </button>
        </div>
      </form>

      {isLoading && <Loading />}
      {showToast && (
        <Toast message="記事を更新しました" type="success" />
      )}
    </main>
  )
}