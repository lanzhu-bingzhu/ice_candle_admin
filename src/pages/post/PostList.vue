<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-slate-800">文章管理</h2>
      <router-link to="/post/new" class="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        新建文章
      </router-link>
    </div>
    <div class="text-sm bg-white/80 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <table class="w-full text-left">
        <thead class="bg-slate-50 text-slate-600 text-sm">
        <tr>
          <th class="p-4">标题</th>
          <th class="p-4 hidden sm:table-cell">类型</th>
          <th class="p-4 hidden md:table-cell">分类ID</th>
          <th class="p-4 hidden lg:table-cell">创建时间</th>
          <th class="p-4">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="post in posts" :key="post.post_id" class="border-t border-slate-100 hover:bg-slate-50 transition">
          <td class="p-4 font-medium">{{ post.title }}</td>
          <td class="p-4 hidden sm:table-cell">
              <span class="text-xs px-2 py-0.5 rounded-full"
                    :class="post.type_id === 2 ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                {{ post.type_id === 2 ? '图文' : '文章' }}
              </span>
          </td>
          <td class="p-4 hidden md:table-cell text-slate-500">{{ post.category_id }}</td>
          <td class="p-4 hidden lg:table-cell text-slate-500">{{ post.created_at }}</td>
          <td class="p-4 space-x-2">
            <router-link :to="`/post/${post.post_id}/edit`" class="text-blue-500 hover:underline">编辑</router-link>
            <button @click="handleDelete(post.post_id)" class="text-red-400 hover:underline">删除</button>
          </td>
        </tr>
        <tr v-if="posts.length === 0">
          <td colspan="5" class="p-8 text-center text-slate-400">暂无文章</td>
        </tr>
        </tbody>
      </table>
      <div class="px-4 py-3 bg-slate-50 text-sm text-right text-slate-500 border-t border-slate-200">
        共 {{ totalCount }} 篇文章
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchPosts, deletePost as apiDelete } from '@/services/admin'
import type { Post } from '@/types'

const posts = ref<Post[]>([])
const totalCount = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

async function loadPosts() {
  loading.value = true
  error.value = null
  try {
    const data = await fetchPosts()
    posts.value = data.items
    totalCount.value = data.count
  } catch (e: any) {
    error.value = e.message || '加载文章失败'
  } finally {
    loading.value = false
  }
}

async function handleDelete(postId: string | number) {
  if (!confirm('确定删除这篇文章吗？')) return
  try {
    await apiDelete(String(postId))
    posts.value = posts.value.filter(p => p.post_id !== postId)
    totalCount.value--
  } catch (e: any) {
    alert('删除失败：' + (e.message || '未知错误'))
  }
}

onMounted(loadPosts)
</script>