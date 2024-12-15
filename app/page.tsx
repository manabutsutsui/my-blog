import { supabase } from './lib/supabase'
import type { Post } from './lib/types'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return <div>Error loading posts</div>
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Blog</h1>
        <Link 
          href="/blog/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          新規投稿
        </Link>
      </div>
      
      <div className="space-y-6">
        {posts?.map((post: Post) => (
          <article key={post.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/blog/${post.id}`} className="block">
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">
                {post.title}
              </h2>
              <div className="prose line-clamp-3 text-gray-600">
                <ReactMarkdown>
                  {post.content}
                </ReactMarkdown>
              </div>
              <div className="text-sm text-gray-500 mt-4">
                Posted on {new Date(post.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}