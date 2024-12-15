'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('本当にこの記事を削除しますか？')) {
      return
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) {
      console.error('Error deleting post:', error)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      削除
    </button>
  )
}