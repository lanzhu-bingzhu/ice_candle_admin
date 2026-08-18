<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-slate-800">任务管理</h2>
      <div>
        <button @click="loadTasks" class="text-sm px-4 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 transition">查询</button>
        <router-link to="/task/new" class="text-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ml-2">
          新建任务
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
        <tr v-for="task in tasks" :key="task.task_id" class="border-t border-slate-100 hover:bg-slate-50 transition">
          <td class="p-4 font-medium">{{ task.name }}</td>
          <td class="p-4 hidden md:table-cell">{{ task.title }}</td>
          <td class="p-4 hidden sm:table-cell">
            <span v-if="task.is_show" class="text-xs px-2 py-0.5 rounded-full bg-lime-700 text-lime-100">显示</span>
            <span v-else class="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">隐藏</span>
          </td>
          <td class="p-4 hidden md:table-cell">{{ task.deadline }}</td>
          <td class="p-4 hidden md:table-cell">{{ task.created_at }}</td>
          <td class="p-4 space-x-2">
            <router-link :to="`/task/${task.task_id}/edit`" class="text-ice-500 hover:underline">
              编辑
            </router-link>
            <button @click="handleDelete(task.task_id)" class="text-red-400 hover:underline">
              删除
            </button>
          </td>
        </tr>
        <tr v-if="tasks.length === 0">
          <td colspan="5" class="p-8 text-center text-slate-400">暂无任务</td>
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
import { onMounted, ref } from 'vue'
import type { Task } from '@/types'
import { deleteTask, fetchTasks } from "@/services/admin.ts";
import Loading from "@/components/Loading.vue";
import { toast } from "@/composables/useToast.ts";

const columns = ref<Array<any>>([
  { name: '名称', class: 'text-sm p-4' },
  { name: '标题', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '是否显示', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '结束时间', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '创建时间', class: 'text-sm p-4 hidden sm:table-cell' },
  { name: '操作', class: 'text-sm p-4' }
])

const tasks = ref<Task[]>([])
const totalCount = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

async function loadTasks() {
  loading.value = true
  error.value = null

  await fetchTasks().then(res => {
    tasks.value = res.data.items
    totalCount.value = res.data.count
  }).catch(_e => {
    toast.error(error.value || '加载任务失败')
  }).finally(() => {
    loading.value = false
  })
}

async function handleDelete(id: string | number) {
  if (!confirm('确定删除这个任务吗？')) return

  await deleteTask(String(id)).then(_res => {
    tasks.value = tasks.value.filter(t => t.task_id !== id)
    totalCount.value--
  }).catch(e => {
    toast.error('删除失败：' + (e.message || '未知错误'))
  })
}

onMounted(loadTasks)
</script>

<style scoped>

</style>