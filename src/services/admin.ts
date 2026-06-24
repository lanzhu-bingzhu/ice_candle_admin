import request from './api'
import type { Post, Category } from '@/types'

export const fetchPosts = () =>
  request.get<any, Post[]>('/admin/posts')

export const fetchPostById = (post_id: string) =>
  request.get<any, Post>(`/admin/posts/${post_id}`)

export const createPost = (data: Partial<Post>) =>
  request.post<any, Post>('/admin/posts', data)

export const updatePost = (post_id: string, data: Partial<Post>) =>
  request.put<any, Post>(`/admin/posts/${post_id}`, data)

export const deletePost = (post_id: string) =>
  request.delete(`/admin/posts/${post_id}`)

export const fetchCategories = () =>
  request.get<any, Category[]>('/admin/categories')