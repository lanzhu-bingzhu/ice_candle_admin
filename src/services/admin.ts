import request from './api'
import type {
  Post,
  PostResponse,
  PostListResponse,
  Category,
  CategoryResponse,
  CategoryListResponse,
  Floor,
  FloorResponse,
  FloorListResponse,
  TaskResponse,
  TaskListResponse,
  PostTagListResponse,
  Config, Task, ConfigListResponse, ConfigResponse
} from '@/types'

// ========== 文章 ==========
export const fetchPosts = () => request.get<any, PostListResponse>('/post')

export const fetchPostById = (post_id: string | number) => request.get<any, PostResponse>(`/post/${post_id}`)

export const createPost = (data: Partial<Post>) => request.post<any, PostResponse>('/post', data)

export const updatePost = (post_id: string | number, data: Partial<Post>) => request.put<any, PostResponse>(`/post/${post_id}`, data)

export const deletePost = (post_id: string | number) => request.delete<any, PostResponse>(`/post/${post_id}`)

export const fetchAllPostTags = () => request.get<any, PostTagListResponse>('/post_tag/get_all_post_tag')

// ========== 分类 ==========
export const fetchCategories = () => request.get<any, CategoryListResponse>('/category')

export const fetchAllCategories = () => request.get<any, CategoryListResponse>('/category/get_all_category')

// 新增分类
export const createCategory = (data: Partial<Category>) => request.post<any, CategoryResponse>('/category', data)
// 更新分类
export const updateCategory = (category_id: string | number, data: Partial<Category>) => request.put<any, CategoryResponse>(`/category/${category_id}`, data)
// 删除分类
export const deleteCategory = (category_id: string | number) => request.delete<any, CategoryResponse>(`/category/${category_id}`)

export const fetchCategoryById = (category_id: string | number) => request.get<any, CategoryResponse>(`/category/${category_id}`)

// ========== 楼层 ==========
export const fetchFloors = () => request.get<any, FloorListResponse>('/floor')

export const createFloor = (data: Partial<Floor>) => request.post<any, FloorResponse>('/floor', data)

export const updateFloor = (floor_id: string | number, data: Partial<Floor>) => request.put<any, FloorResponse>(`/floor/${floor_id}`, data)

export const deleteFloor = (floor_id: string | number) => request.delete<any, FloorResponse>(`/floor/${floor_id}`)

export const fetchFloorById = (floor_id: string | number) => request.get<any, FloorResponse>(`/floor/${floor_id}`)

// ========== 楼层 ==========
export const fetchTasks = () => request.get<any, TaskListResponse>('/task')

export const createTask = (data: Partial<Task>) => request.post<any, TaskResponse>('/task', data)

export const updateTask = (task_id: string | number, data: Partial<Task>) => request.put<any, TaskResponse>(`/task/${task_id}`, data)

export const deleteTask = (task_id: string | number) => request.delete<any, TaskResponse>(`/task/${task_id}`)

export const fetchTaskById = (task_id: string | number) => request.get<any, TaskResponse>(`/task/${task_id}`)

// ========== 网站配置 ==========

export const fetchConfig = () => request.get<any, ConfigListResponse>('/config')

export const createConfig = (data: any) => request.post<any, ConfigResponse>('/config', data)
