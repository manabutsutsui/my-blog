import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { use } from 'react'
import type { Post } from '../../lib/types'
import DeleteButton from './DeleteButton'
import ReactMarkdown from 'react-markdown'

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

async function getPost(id: string) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    throw new Error('Post not found')
  }

  return post as Post
}

export default function BlogPost({ params }: PageProps) {
  const { id } = use(params)
  const post = use(getPost(id))

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-8">
      <article className="prose lg:prose-xl">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          Posted on {new Date(post.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          {post.updated_at !== post.created_at && (
            <span className="ml-2">
              (更新: {new Date(post.updated_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })})
            </span>
          )}
        </div>

        <div className="flex gap-4 mb-8">
          <Link
            href={`/blog/${id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            編集
          </Link>
          <DeleteButton postId={id} />
        </div>

        <div className="mt-8">
          <ReactMarkdown className="prose">
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  )
}