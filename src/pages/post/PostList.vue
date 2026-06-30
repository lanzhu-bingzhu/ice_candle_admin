<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-slate-800">文章管理</h2>
      <router-link to="/post/new"
        class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">新建文章</router-link>
    </div>
    <div class="bg-white/80 border border-slate-200 rounded-2xl overflow-hidden">
      <table class="w-full text-center">
        <thead class="bg-slate-50 text-slate-600 text-sm">
        <tr>
          <th class="p-4">标题</th>
          <th class="p-4 hidden sm:table-cell">分类</th>
          <th class="p-4 hidden md:table-cell">更新时间</th>
          <th class="p-4">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="post in posts" :key="post.post_id" class="border-t border-slate-100 hover:bg-slate-50 transition">
          <td class="p-4 font-medium">{{ post.title }}</td>
          <td class="p-4 hidden sm:table-cell text-slate-500">{{ post.category_id }}</td>
          <td class="p-4 hidden md:table-cell text-slate-500">{{ post.updated_at }}</td>
          <td class="p-4 space-x-2">
            <router-link :to="`/post/${post.post_id}/edit`" class="text-blue-500 hover:underline">编辑</router-link>
            <button @click="deletePost(post.post_id)" class="text-red-400 hover:underline">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="!posts.length" class="p-8 text-center text-slate-400">暂无文章</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchPosts, deletePost as apiDelete } from '@/services/admin'
import type { Post } from '@/types'

const posts = ref<Post[]>([])

onMounted(async () => {
  posts.value = await fetchPosts()
})

const deletePost = async (id: string) => {
  if (confirm('确定删除？')) {
    await apiDelete(id)
    posts.value = posts.value.filter(p => p.post_id !== id)
  }
}
</script>