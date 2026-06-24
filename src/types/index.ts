export interface Post {
  post_id: string
  title: string
  content: string
  category_id: string
  summary?: string
  tags?: string[]
  cover?: string
  created_at: string
  updated_at: string
}

export interface Category {
  category_id: string
  name: string
  type: 'article' | 'image-text'
  parent_id?: string | null
}