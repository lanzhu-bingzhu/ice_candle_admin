<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-slate-800">分类管理</h2>
      <router-link to="/category/new" class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
        新建分类
      </router-link>
    </div>
    <!-- 分类表格 -->
    <div class="bg-white/80 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <table class="w-full text-center">
        <thead class="bg-slate-50 text-slate-600 text-sm">
        <tr>
          <th class="p-4">分类名称</th>
          <th class="p-4 hidden sm:table-cell">父级分类</th>
          <th class="p-4 hidden md:table-cell">类型</th>
          <th class="p-4 hidden lg:table-cell">创建时间</th>
          <th class="p-4">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="cat in categories" :key="cat.category_id" class="border-t border-slate-100 hover:bg-slate-50 transition">
          <td class="p-4 font-medium">{{ cat.name }}</td>
          <td class="p-4 hidden sm:table-cell text-slate-500">
            {{ getParentName(cat.parent_id) || '顶级分类' }}
          </td>
          <td class="p-4 hidden md:table-cell">
            <span class="text-xs px-2 py-0.5 rounded-full" :class="cat.type === 'image-text' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
              {{ cat.type === 'image-text' ? '图文' : '文章' }}
            </span>
          </td>
          <td class="p-4 hidden lg:table-cell text-slate-500 text-sm">
            {{ cat.created_at || '-' }}
          </td>
          <td class="p-4 space-x-2">
            <router-link :to="`/category/${cat.category_id}/edit`" class="text-blue-500 hover:underline text-sm">
              编辑
            </router-link>
            <button @click="handleDelete(cat.category_id)" class="text-red-400 hover:underline text-sm">
              删除
            </button>
          </td>
        </tr>
        <tr v-if="categories.length === 0">
          <td colspan="5" class="p-8 text-center text-slate-400">暂无分类</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCategories, deleteCategory } from '@/services/admin'
import type { Category } from '@/types'

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 根据 category_id 获取分类名称
function getParentName(parentId?: string | number | null) {
  if (!parentId) return null
  const parent = categories.value.find((c) => c.category_id === parentId)
  return parent?.name || null
}

async function loadCategories() {
  loading.value = true
  error.value = null
  try {
    categories.value = await fetchCategories()
  } catch (e: any) {
    error.value = e.message || '加载分类失败'
  } finally {
    loading.value = false
  }
}

async function handleDelete(categoryId: string) {
  if (!confirm('确定要删除该分类吗？')) return
  try {
    await deleteCategory(categoryId)
    categories.value = categories.value.filter((c) => c.category_id !== categoryId)
  } catch (e: any) {
    alert('删除失败：' + (e.message || '未知错误'))
  }
}

onMounted(loadCategories)
</script>