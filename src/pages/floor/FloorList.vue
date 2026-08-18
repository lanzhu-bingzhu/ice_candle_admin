<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-slate-800">楼层管理</h2>
      <div>
        <button @click="loadFloors" class="text-sm px-4 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 transition">查询</button>
        <router-link to="/floor/new" class="text-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ml-2">
          新建楼层
        </router-link>
      </div>
    </div>
    <!-- 分类表格 -->
    <div class="text-sm bg-white/80 border border-slate-200 rounded-lg overflow-hidden shadow-sm relative">
      <table class="w-full text-center">
        <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th v-for="column in columns" :class="column.class">{{ column.name }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="floor in floors" :key="floor.floor_id" class="border-t border-slate-100 hover:bg-slate-50 transition">
          <td class="p-4 font-medium">{{ floor.title }}</td>
          <td class="p-4 hidden md:table-cell">
            <span v-if="floor.category">{{ floor.category.name }}</span>
          </td>
          <td class="p-4 hidden md:table-cell">
            <span v-if="floor.floor_type.name === 'banner'" class="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {{ floor.floor_type.name }}
            </span>
            <span v-if="floor.floor_type.name === 'article'" class="text-xs px-2 py-0.5 rounded-full bg-ice-100 text-ice-700">
              {{ floor.floor_type.name }}
            </span>
            <span v-if="floor.floor_type.name === 'image-text'" class="text-xs px-2 py-0.5 rounded-full bg-lime-100 text-lime-700">
              {{ floor.floor_type.name }}
            </span>
          </td>
          <td class="p-4 hidden lg:table-cell text-slate-500">{{ floor.link }}</td>
          <td class="p-4 hidden lg:table-cell text-slate-500">{{ floor.sort }}</td>
          <td class="p-4 hidden sm:table-cell">
            <span v-if="floor.is_show" class="text-xs px-2 py-0.5 rounded-full bg-lime-700 text-lime-100">显示</span>
            <span v-else class="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">隐藏</span>
          </td>
          <td class="p-4 space-x-2">
            <router-link :to="`/floor/${floor.floor_id}/edit`" class="text-ice-500 hover:underline">
              编辑
            </router-link>
            <button @click="handleDelete(floor.floor_id)" class="text-red-400 hover:underline">
              删除
            </button>
          </td>
        </tr>
        <tr v-if="floors.length === 0">
          <td colspan="5" class="p-8 text-center text-slate-400">暂无楼层</td>
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
import {onMounted, ref} from 'vue'
import type { Floor } from '@/types'
import { deleteFloor as apiDelete, fetchFloors } from "@/services/admin.ts";
import Loading from "@/components/Loading.vue";
import { toast } from "@/composables/useToast.ts";

const columns = ref<Array<any>>([
  { name: '标题', class: 'text-sm p-4' },
  { name: '分类', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '类型', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '链接', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '排序', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '是否显示', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '操作', class: 'text-sm p-4' }
])

const floors = ref<Floor[]>([])
const totalCount = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

async function loadFloors() {
  loading.value = true
  error.value = null

  await fetchFloors().then(res => {
    floors.value = res.data.items
    totalCount.value = res.data.count
  }).catch(e => {
    error.value = e.message || '加载楼层失败'
    toast.error(error.value || '加载楼层失败')
  }).finally(() => {
    loading.value = false
  })
}

async function handleDelete(id: string | number) {
  if (!confirm('确定删除这个楼层吗？')) return

  await apiDelete(String(id)).then(_res => {
    floors.value = floors.value.filter(f => f.floor_id !== id)
    totalCount.value--
  }).catch(e => {
    toast.error('删除失败：' + (e.message || '未知错误'))
  })
}

onMounted(loadFloors)
</script>

<style scoped>

</style>