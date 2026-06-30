<template>
  <div class="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm">
    <h2 class="text-2xl font-bold text-slate-800 mb-6">
      {{ isEdit ? '编辑分类' : '新建分类' }}
    </h2>

    <div class="space-y-4 max-w-2xl">
      <!-- 分类名称 -->
      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">分类名称</label>
        <input v-model="form.name" class="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" placeholder="输入分类名称"/>
      </div>

      <!-- 父级分类 -->
      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">父级分类</label>
        <select v-model="form.parent_id" class="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none">
          <option :value="null">无（顶级分类）</option>
          <option v-for="cat in availableParents" :key="cat.category_id" :value="cat.category_id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- 类型 -->
      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">类型</label>
        <select v-model="form.type" class="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none">
          <option value="article">文章</option>
          <option value="image-text">图文</option>
        </select>
      </div>

      <!-- 描述 -->
      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">描述</label>
        <textarea
            v-model="form.description"
            rows="3"
            class="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            placeholder="简要描述该分类"
        ></textarea>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-4 pt-2">
        <button
            @click="save"
            :disabled="saving"
            class="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
        >
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <router-link to="/categories" class="px-6 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
          取消
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  fetchCategoryById,
} from '@/services/admin'
import type { Category } from '@/types'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.category_id)

const form = reactive<{
  name: string
  parent_id: string | number | null
  type: 'article' | 'image-text'
  description: string
}>({
  name: '',
  parent_id: null,
  type: 'article',
  description: '',
})

const allCategories = ref<Category[]>([])
const saving = ref(false)

// 可选的父级分类：排除自身（编辑时）和已经是子分类的分类（避免多级嵌套，可自行调整）
const availableParents = computed(() => {
  return allCategories.value.filter((cat) => {
    // 编辑时排除自己
    if (isEdit.value && cat.category_id === route.params.category_id) return false
    return true
  })
})

async function loadData() {
  try {
    allCategories.value = await fetchCategories()
    if (isEdit.value) {
      const cat = await fetchCategoryById(route.params.category_id as string)
      if (cat) {
        form.name = cat.name
        form.parent_id = cat.parent_id || null
        form.type = cat.type
        form.description = cat.description || ''
      }
    }
  } catch (e: any) {
    alert('加载分类数据失败')
    router.push('/categories')
  }
}

async function save() {
  if (!form.name.trim()) {
    alert('请输入分类名称')
    return
  }

  saving.value = true
  try {
    const payload = {
      name: form.name,
      parent_id: form.parent_id,
      type: form.type,
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