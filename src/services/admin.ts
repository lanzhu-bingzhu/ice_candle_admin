import request from './api'
import type { Post, Category, Floor } from '@/types'

// ========== 文章 ==========
export const fetchPosts = () => request.get<any, Post[]>('/admin/post')

export const fetchPostById = (post_id: string) => request.get<any, Post>(`/admin/post/${post_id}`)

export const createPost = (data: Partial<Post>) => request.post<any, Post>('/admin/post', data)

export const updatePost = (post_id: string, data: Partial<Post>) => request.put<any, Post>(`/admin/post/${post_id}`, data)

export const deletePost = (post_id: string) => request.delete(`/admin/post/${post_id}`)

// ========== 分类 ==========
export const fetchCategories = () => request.get<any, Category[]>('/admin/category')
// 新增分类
export const createCategory = (data: Partial<Category>) => request.post<any, Category>('/admin/category', data)
// 更新分类
export const updateCategory = (category_id: string, data: Partial<Category>) => request.put<any, Category>(`/admin/category/${category_id}`, data)
// 删除分类
export const deleteCategory = (category_id: string) => request.delete(`/admin/category/${category_id}`)

export const fetchCategoryById = (category_id: string) => request.get<any, Category>(`/admin/category/${category_id}`)

// ========== 楼层 ==========
export const fetchFloors = () => request.get<any, Floor[]>('/admin/floors')

export const createFloor = (data: Partial<Floor>) => request.post<any, Floor>('/admin/floor', data)

export const updateFloor = (floor_id: string, data: Partial<Floor>) => request.put<any, Floor>(`/admin/floor/${floor_id}`, data)

export const deleteFloor = (floor_id: string) => request.delete(`/admin/floor/${floor_id}`)

export const fetchFloorById = (floor_id: string) => request.get<any, Floor>(`/admin/floor/${floor_id}`)