<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-slate-800">楼层管理</h2>
      <router-link to="/floor/new" class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
        新建楼层
      </router-link>
    </div>
    <!-- 分类表格 -->
    <div class="bg-white/80 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <table class="w-full text-center">
        <thead class="bg-slate-50 text-slate-600 text-sm">
        <tr>
          <th v-for="column in columns" :class="column.class">{{ column.name }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="cat in floors" :key="cat.category_id" class="border-t border-slate-100 hover:bg-slate-50 transition">
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
        <tr v-if="floors.length === 0">
          <td colspan="5" class="p-8 text-center text-slate-400">暂无分类</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = ref<Array>([
  { name: '标题', class: 'p-4' },
  { name: '分类', class: 'p-4 hidden sm:table-cell' },
  { name: '类型', class: 'p-4 hidden sm:table-cell' },
  { name: '路由', class: 'p-4 hidden sm:table-cell' },
  { name: '排序', class: 'p-4 hidden sm:table-cell' },
  { name: '操作', class: 'p-4' }
])

const floors = ref<Array>([])

</script>

<style scoped>

</style>