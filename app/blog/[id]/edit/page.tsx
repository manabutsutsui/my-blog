import { supabase } from '../../../lib/supabase'
import { use } from 'react'
import EditForm from './EditForm'
import type { Post } from '../../../lib/types'

type Props = {
  params: {
    id: string
  }
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

export default function EditPage({ params }: Props) {
  const id = use(Promise.resolve(params.id))
  const post = use(getPost(id))

  return <EditForm post={post} />
}