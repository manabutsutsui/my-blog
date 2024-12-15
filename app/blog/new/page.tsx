'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import Toast from '../../components/Toast'
import ReactMarkdown from 'react-markdown'

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const { error: insertError } = await supabase
        .from('posts')
        .insert([{ title, content }])

      if (insertError) throw insertError

      setShowToast(true)
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    } catch (err) {
      setError('記事の投稿中にエラーが発生しました。')
      console.error('Error creating post:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">新規投稿</h1>
      
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
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              本文
            </label>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {isPreview ? 'エディタに戻る' : 'プレビュー'}
            </button>
          </div>

          {isPreview ? (
            <div className="prose min-h-[300px] w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              <ReactMarkdown>
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">マークダウン記法が使えます：</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>- **太字** や *イタリック*</li>
            <li>- # 見出し（# の数で大きさを変更）</li>
            <li>- [リンク](URL)</li>
            <li>- `コード`</li>
            <li>- リスト（- や 1. で作成）</li>
          </ul>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '投稿中...' : '投稿する'}
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
        <Toast message="記事を投稿しました" type="success" />
      )}
    </main>
  )
}