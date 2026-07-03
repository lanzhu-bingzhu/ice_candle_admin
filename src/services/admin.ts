import request from './api'
import type { Post, PostResponse, PostListResponse, Category, CategoryResponse, CategoryListResponse, Floor, FloorResponse, FloorListResponse } from '@/types'

// ========== 文章 ==========
export const fetchPosts = () => request.get<any, PostListResponse>('/post').then(res => res.data)

export const fetchPostById = (post_id: string) => request.get<any, PostResponse>(`/post/${post_id}`).then(res => res.data)

export const createPost = (data: Partial<Post>) => request.post<any, PostResponse>('/post', data).then(res => res.data)

export const updatePost = (post_id: string, data: Partial<Post>) => request.put<any, PostResponse>(`/post/${post_id}`, data).then(res => res.data)

export const deletePost = (post_id: string) => request.delete(`/post/${post_id}`).then(res => res.data)

// ========== 分类 ==========
export const fetchCategories = () => request.get<any, CategoryListResponse>('/category').then(res => res.data)

export const fetchAllCategories = () => request.get<any, CategoryListResponse>('/category/get_all_category').then(res => res.data)

// 新增分类
export const createCategory = (data: Partial<Category>) => request.post<any, CategoryResponse>('/category', data).then(res => res.data)
// 更新分类
export const updateCategory = (category_id: string, data: Partial<Category>) => request.put<any, CategoryResponse>(`/category/${category_id}`, data).then(res => res.data)
// 删除分类
export const deleteCategory = (category_id: string) => request.delete(`/category/${category_id}`).then(res => res.data)

export const fetchCategoryById = (category_id: string) => request.get<any, CategoryResponse>(`/category/${category_id}`).then(res => res.data)

// ========== 楼层 ==========
export const fetchFloors = () => request.get<any, FloorListResponse>('/floors').then(res => res.data)

export const createFloor = (data: Partial<Floor>) => request.post<any, FloorResponse>('/floor', data).then(res => res.data)

export const updateFloor = (floor_id: string, data: Partial<Floor>) => request.put<any, FloorResponse>(`/floor/${floor_id}`, data).then(res => res.data)

export const deleteFloor = (floor_id: string) => request.delete(`/floor/${floor_id}`).then(res => res.data)

export const fetchFloorById = (floor_id: string) => request.get<any, FloorResponse>(`/floor/${floor_id}`).then(res => res.data)