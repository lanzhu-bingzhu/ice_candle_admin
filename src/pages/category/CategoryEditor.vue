<template>
  <div class="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm">
    <h2 class="text-2xl font-bold text-slate-800 mb-6">
      {{ isEdit ? '编辑分类' : '新建分类' }}
    </h2>

    <form class="space-y-4 text-sm">
      <!-- 分类名称 -->
      <div class="mb-3">
        <label class="w-full p-3 text-left block">分类名称：</label>
        <input v-model="form.name" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="输入分类名称"/>
      </div>

      <!-- 父级分类 -->
      <div class="mb-3">
        <label class="w-full p-3 text-left block">父级分类：</label>
        <select v-model="form.parent_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none">
          <option :value="null">无（顶级分类）</option>
          <option v-for="cat in availableParents" :key="cat.category_id" :value="cat.category_id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- 类型 -->
      <div class="mb-3">
        <label class="w-full p-3 text-left block">类型：</label>
        <select v-model="form.type_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none">
          <option :value="1">分类</option>
          <option :value="2">文章</option>
          <option :value="3">图文</option>
        </select>
      </div>

      <!-- 描述 -->
      <div class="mb-3">
        <label class="w-full p-3 text-left block">描述：</label>
        <textarea
            v-model="form.description"
            rows="3"
            class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="简要描述该分类"
        ></textarea>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">保存</button>
        <router-link to="/post" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  createCategory,
  updateCategory,
  fetchCategoryById,
  fetchAllCategories,
} from '@/services/admin'
import type { Category } from '@/types'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.category_id)

const form = reactive<{
  name: string
  parent_id: string | null | undefined
  type_id: string | number
  description: string
}>({
  name: '',
  parent_id: null,
  type_id: 1,
  description: '',
})

const allCategories = ref<Category[]>([])
const saving = ref(false)

// 可选的父级分类：排除自身（编辑时）和已经是子分类的分类（避免多级嵌套，可自行调整）
const availableParents = computed(() => {
  return allCategories.value.filter(cat => !(isEdit.value && cat.category_id == route.params.category_id))
})

async function loadData() {
  try {
    const data = await fetchAllCategories()
    allCategories.value = data.items
    if (isEdit.value) {
      const cat = await fetchCategoryById(route.params.category_id as string)
      if (cat) {
        form.name = cat.name
        form.parent_id = cat.parent_id || null
        form.type_id = cat.type_id
        form.description = cat.description || ''
      }
    }
  } catch (e: any) {
    alert('加载分类数据失败')
    router.push('/category')
  }
}

async function save() {
  if (!form.name.trim()) {
    alert('请输入分类名称')
    return
  }

  saving.value = true
  try {
    const payload: Category = {
      name: form.name,
      parent_id: form.parent_id,
      type_id: form.type_id,
      description: form.description,
    }

    if (isEdit.value) {
      await updateCategory(route.params.category_id as string, payload)
    } else {
      await createCategory(payload)
    }
    router.push('/categories')
  } catch (e: any) {
    alert('保存失败：' + (e.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>