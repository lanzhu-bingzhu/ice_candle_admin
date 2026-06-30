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
  type: string
  description: string
  parent_id?: string | null
  created_at: string
  updated_at: string
}

export interface Floor {
  floor_id: string
  category_id: string
  category_name: string
  type_id: string
  type_name: string
  title?: string
  description?: string
  image?: string
  link?: string
  alt?: string
  sort: number
  created_at: string
  updated_at: string
}