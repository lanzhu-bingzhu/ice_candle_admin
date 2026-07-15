import request from './api'
import type { Post, PostResponse, PostListResponse, Category, CategoryResponse, CategoryListResponse, Floor, FloorResponse, FloorListResponse, TaskResponse, TaskListResponse, PostTagListResponse } from '@/types'

// ========== 文章 ==========
export const fetchPosts = () => request.get<any, PostListResponse>('/post').then(res => res.data)

export const fetchPostById = (post_id: string | number) => request.get<any, PostResponse>(`/post/${post_id}`).then(res => res.data)

export const createPost = (data: Partial<Post>) => request.post<any, PostResponse>('/post', data).then(res => res.data)

export const updatePost = (post_id: string | number, data: Partial<Post>) => request.put<any, PostResponse>(`/post/${post_id}`, data).then(res => res.data)

export const deletePost = (post_id: string | number) => request.delete<any, PostResponse>(`/post/${post_id}`).then(res => res.data)

export const fetchAllPostTags = () => request.get<any, PostTagListResponse>('/post_tag/get_all_post_tag').then(res => res.data)

// ========== 分类 ==========
export const fetchCategories = () => request.get<any, CategoryListResponse>('/category').then(res => res.data)

export const fetchAllCategories = () => request.get<any, CategoryListResponse>('/category/get_all_category').then(res => res.data)

// 新增分类
export const createCategory = (data: Partial<Category>) => request.post<any, CategoryResponse>('/category', data).then(res => res.data)
// 更新分类
export const updateCategory = (category_id: string | number, data: Partial<Category>) => request.put<any, CategoryResponse>(`/category/${category_id}`, data).then(res => res.data)
// 删除分类
export const deleteCategory = (category_id: string | number) => request.delete<any, CategoryResponse>(`/category/${category_id}`).then(res => res.data)

export const fetchCategoryById = (category_id: string | number) => request.get<any, CategoryResponse>(`/category/${category_id}`).then(res => res.data)

// ========== 楼层 ==========
export const fetchFloors = () => request.get<any, FloorListResponse>('/floor').then(res => res.data)

export const createFloor = (data: Partial<Floor>) => request.post<any, FloorResponse>('/floor', data).then(res => res.data)

export const updateFloor = (floor_id: string | number, data: Partial<Floor>) => request.put<any, FloorResponse>(`/floor/${floor_id}`, data).then(res => res.data)

export const deleteFloor = (floor_id: string | number) => request.delete<any, FloorResponse>(`/floor/${floor_id}`).then(res => res.data)

export const fetchFloorById = (floor_id: string | number) => request.get<any, FloorResponse>(`/floor/${floor_id}`).then(res => res.data)

// ========== 楼层 ==========
export const fetchTasks = () => request.get<any, TaskListResponse>('/task').then(res => res.data)

export const createTask = (data: Partial<Floor>) => request.post<any, TaskResponse>('/task', data).then(res => res.data)

export const updateTask = (task_id: string | number, data: Partial<Floor>) => request.put<any, TaskResponse>(`/task/${task_id}`, data).then(res => res.data)

export const deleteTask = (task_id: string | number) => request.delete<any, TaskResponse>(`/task/${task_id}`).then(res => res.data)

export const fetchTaskById = (task_id: string | number) => request.get<any, TaskResponse>(`/task/${task_id}`).then(res => res.data)