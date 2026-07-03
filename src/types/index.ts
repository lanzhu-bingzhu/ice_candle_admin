export interface Post {
  post_id: string
  title: string
  type: string
  content: string
  category_id: string
  summary?: string
  tags?: string[]
  cover?: string
  created_at: string
  updated_at: string
}

export interface PostListResponse {
  code: number
  message: string
  data: {
    items: Post[]
    count: number
  }
}

export interface PostResponse {
  code: number
  message: string
  data: Post
}

export interface Category {
  category_id?: string
  name: string
  type_id: string | number
  type?: string
  description: string
  parent_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface CategoryListResponse {
  code: number
  message: string
  data: {
    items: Category[]
    count: number
  }
}

export interface CategoryResponse {
  code: number
  message: string
  data: Category
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

export interface FloorListResponse {
  code: number
  message: string
  data: {
    items: Floor[]
    count: number
  }
}

export interface FloorResponse {
  code: number
  message: string
  data: Floor
}