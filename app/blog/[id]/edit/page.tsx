import { use } from 'react'
import EditForm from './EditForm'
import { supabase } from '../../../lib/supabase'
import type { Post } from '../../../lib/types'

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

export default function EditPage({ params }: PageProps) {
  const { id } = use(params)
  const post = use(getPost(id))

  return <EditForm post={post} />
}