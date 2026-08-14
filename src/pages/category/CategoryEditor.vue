<template>
  <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm relative">
    <h2 class="text-lg font-bold text-slate-800 mb-6">{{ isEdit ? '编辑分类' : '新建分类' }}</h2>

    <div class="space-y-4 text-sm">
      <!-- 分类名称 -->
      <div class="mb-3">
        <label class="w-full p-3 text-left block">分类名称：</label>
        <input v-model="form.name" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="输入分类名称"/>
      </div>
      <!-- 父级分类 -->
      <div class="mb-3">
        <label class="w-full p-3 text-left block">父级分类：</label>
        <select v-model="form.parent_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none">
          <option :value="0">无（顶级分类）</option>
          <option v-for="cat in availableParents" :key="cat.category_id" :value="cat.category_id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <!-- 类型 -->
      <div class="mb-3">
        <label class="w-full p-3 text-left block">类型：</label>
        <select v-model="form.type_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none">
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
            class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none"
            placeholder="简要描述该分类"
        ></textarea>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">是否展示：</span>
          <span class="w-full p-2 outline-none text-left block">
            <label>
              <input v-model="form.is_show" type="radio" name="is_show" :value="1" /> 是
            </label>
            <label>
              <input v-model="form.is_show" type="radio" name="is_show" :value="0" class="ml-2" /> 否
            </label>
          </span>
        </label>
      </div>
      <!-- 操作按钮 -->
      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 transition">保存</button>
        <router-link to="/category" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </div>
    <loading :loading="saving"></loading>
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
import Loading from "@/components/Loading.vue";
import { toast } from "@/composables/useToast.ts";

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.category_id)

const form = reactive<{
  name: string,
  parent_id?: string | number | null,
  type_id: string | number,
  description: string,
  is_show: string | number
}>({
  name: '',
  parent_id: 0,
  type_id: 1,
  description: '',
  is_show: 1
})

const allCategories = ref<Category[]>([])
const saving = ref(false)

// 可选的父级分类：排除自身（编辑时）和已经是子分类的分类（避免多级嵌套，可自行调整）
const availableParents = computed(() => {
  return allCategories.value.filter(cat => !(isEdit.value && cat.category_id == route.params.category_id))
})

async function loadData() {
  saving.value = true
  await fetchAllCategories().then(res => {
    allCategories.value = res.data.items.filter(item => item.parent_id == 0)
    if (isEdit.value) {
      fetchCategoryById(route.params.category_id as string).then(res => {
        if (res.data) {
          form.name = res.data.name
          form.parent_id = res.data.parent_id
          form.type_id = res.data.type_id
          form.description = res.data.description
          form.is_show = res.data.is_show
        }
      })
    }
    saving.value = false
  }).catch(_e => {
    toast.error('加载分类数据失败')
    saving.value = false
  })
}

async function save() {
  saving.value = true

  const payload = { ...form }
  if (isEdit.value) {
    await updateCategory(route.params.category_id as string, payload).then(_res => {
      toast.success('编辑成功')
    }).catch(_e => {
      toast.error('编辑失败')
    })
  } else {
    await createCategory(payload).then(res => {
      toast.success('添加成功')
      router.push(`/category/${res.data}/edit`)
    }).catch(_e => {
      toast.error('添加失败')
    })
  }

  saving.value = false
}

onMounted(loadData)
</script>