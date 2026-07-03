<template>
  <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm">
    <h2 class="text-lg font-bold text-slate-800 mb-6">{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
    <form class="space-y-4 text-sm">
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">标题：</span>
          <input v-model="form.title" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="文章标题" />
        </label>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">分类：</span>
          <select v-model="form.category_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none">
            <option value="">选择分类</option>
            <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
          </select>
        </label>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">摘要：</span>
          <textarea v-model="form.summary" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="文章摘要" />
        </label>
      </div>
      <div class="mb-3">
        <TiptapEditor v-model="form.content" />
      </div>
      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">保存</button>
        <router-link to="/post" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { fetchCategories, createPost, updatePost, fetchPostById } from '@/services/admin'
import type { Category } from '@/types'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.post_id)

const form = reactive({
  title: '',
  category_id: '',
  content: '',
  type_id: 1,
  summary: '',
  cover: '',
  description: '',
})

const categories = ref<Category[]>([])

onMounted(async () => {
  categories.value = await fetchCategories()
  if (isEdit.value) {
    const post = await fetchPostById(route.params.post_id as string)
    if (post) {
      form.title = post.title
      form.category_id = post.category_id
      form.content = post.content
    }
  }
})

const save = async () => {
  const payload = { ...form }
  if (isEdit.value) {
    await updatePost(route.params.post_id as string, payload)
  } else {
    await createPost(payload)
  }
  router.push('/posts')
}
</script>