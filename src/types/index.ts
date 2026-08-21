export interface Response {
  code: number
  message: string
  data: any
}

export interface Post {
  post_id: number
  title: string
  type: string
  type_id: number
  content?: string
  category_id: number
  summary?: string
  tags?: string[]
  cover?: string
  images: string[]
  is_show: string | number
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
  category_id: string | number
  name: string
  type_id: string | number
  type?: string
  description: string
  parent_id?: string | number | null
  is_show: string | number
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
  floor_id: string | number
  category_id: string | number
  category: Category
  type_id: string | number
  floor_type: FloorType
  title: string
  description?: string
  image?: string
  link?: string
  alt?: string
  sort: number
  is_show: string | number
  created_at: string
  updated_at: string
}

export interface FloorType {
  floor_type_id: number | string
  name: string
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

export interface Task {
  task_id: string | number
  name: string
  title: string
  overall_description: string
  header_image: string
  deadline: string
  task_nodes: TaskNode[]
  is_show: string | number
  created_at?: string
  updated_at?: string
}

export interface TaskNode {
  task_node_id?: string | number
  task_id?: string | number
  title: string
  description: string
  details: string
  status_id: number
  completed_at: string
  result: {
    text: string,
    images: string[],
  }
  created_at?: string
  updated_at?: string
}

export interface TaskListResponse {
  code: number
  message: string
  data: {
    items: Task[]
    count: number
  }
}

export interface TaskResponse {
  code: number
  message: string
  data: Task
}

export interface PostTag {
  post_tag_id: string | number
  name: string
  created_at: string
  updated_at: string
}

export interface PostTagListResponse {
  code: number
  message: string
  data: {
    items: PostTag[]
    count: number
  }
}

export interface PostTagResponse {
  code: number
  message: string
  data: PostTag
}

export interface Config {
  header_image?: string
  navigation_image?: string
  recommendations_image?: string[]
  recommendations_content?: {
    title: string
    description: string
    image: string
    link: string
  }[]
  introduction_image?: string
  introduction_text?: string
}

export interface ConfigListResponse {
  code: number
  message: string
  data: {
    items: Config
    count: number
  }
}

export interface ConfigResponse {
  code: number
  message: string
  data: Config
}