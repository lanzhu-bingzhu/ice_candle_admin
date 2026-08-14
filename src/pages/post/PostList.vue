<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-slate-800">文章管理</h2>
      <div>
        <button @click="loadPosts" class="text-sm px-4 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 transition">查询</button>
        <router-link to="/post/new" class="text-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ml-2">
          新建文章
        </router-link>
      </div>
    </div>
    <div class="text-sm bg-white/80 border border-slate-200 rounded-lg overflow-hidden shadow-sm relative">
      <table class="w-full text-center">
        <thead class="bg-slate-50 text-slate-600 text-sm">
        <tr>
          <th class="p-4">标题</th>
          <th class="p-4 hidden sm:table-cell">类型</th>
          <th class="p-4 hidden md:table-cell">分类ID</th>
          <th class="p-4 hidden sm:table-cell">是否显示</th>
          <th class="p-4 hidden lg:table-cell">创建时间</th>
          <th class="p-4">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="post in posts" :key="post.post_id" class="border-t border-slate-100 hover:bg-slate-50 transition">
          <td class="p-4 font-medium">{{ post.title }}</td>
          <td class="p-4 hidden sm:table-cell">
              <span class="text-xs px-2 py-0.5 rounded-full"
                    :class="post.type_id === 2 ? 'bg-purple-100 text-purple-700' : 'bg-ice-100 text-ice-700'">
                {{ post.type_id === 2 ? '图文' : '文章' }}
              </span>
          </td>
          <td class="p-4 hidden md:table-cell text-slate-500">{{ post.category_id }}</td>
          <td class="p-4 hidden sm:table-cell">
            <span v-if="post.is_show" class="text-xs px-2 py-0.5 rounded-full bg-lime-700 text-lime-100">显示</span>
            <span v-else class="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">隐藏</span>
          </td>
          <td class="p-4 hidden lg:table-cell text-slate-500">{{ post.created_at }}</td>
          <td class="p-4 space-x-2">
            <router-link :to="`/post/${post.post_id}/edit`" class="text-ice-500 hover:underline">编辑</router-link>
            <button @click="handleDelete(post.post_id)" class="text-red-400 hover:underline">删除</button>
          </td>
        </tr>
        <tr v-if="posts.length === 0">
          <td colspan="5" class="p-8 text-center text-slate-400">暂无文章</td>
        </tr>
        </tbody>
      </table>
      <loading :loading="loading"></loading>
      <div class="px-4 py-3 bg-slate-50 text-sm text-right text-slate-500 border-t border-slate-200">
        共 {{ totalCount }} 条数据
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchPosts, deletePost as apiDelete } from '@/services/admin'
import type { Post } from '@/types'
import Loading from "@/components/Loading.vue";

const posts = ref<Post[]>([])
const totalCount = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

async function loadPosts() {
  loading.value = true
  error.value = null
  await fetchPosts().then(res => {
    posts.value = res.data.items
    totalCount.value = res.data.count
  }).catch(e => {
    error.value = e.message || '加载文章失败'
  }).finally(() => {
    loading.value = false
  })
}

async function handleDelete(postId: string | number) {
  if (!confirm('确定删除这篇文章吗？')) return
  await apiDelete(String(postId)).then(_res => {
    posts.value = posts.value.filter(p => p.post_id !== postId)
    totalCount.value--
  }).catch(e => {
    alert('删除失败：' + (e.message || '未知错误'))
  })
}

onMounted(loadPosts)
</script>