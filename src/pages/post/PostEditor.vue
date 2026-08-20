<template>
  <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm relative">
    <h2 class="text-lg font-bold text-slate-800 mb-6">{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
    <div class="space-y-4 text-sm">
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">标题：</span>
          <input v-model="form.title" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="文章标题" />
        </label>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">分类：</span>
          <select v-model="form.category_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none">
            <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
          </select>
        </label>
      </div>
      <div class="mb-3">
        <span class="w-full p-3 text-left block">封面图片：</span>
        <cropper-image-upload v-model="form.cover" auto-crop-width="1720" auto-crop-height="572"></cropper-image-upload>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">标签：</span>
          <span class="w-full p-2 outline-none text-left block">
            <template v-for="(tag, index) in postTags">
              <label>
                <input v-model="form.tags" type="checkbox" name="tag_id" :value="tag.post_tag_id" :class="index > 0 ? 'ml-2' : ''" /> {{ tag.name }}
              </label>
            </template>
          </span>
        </label>
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
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">类型：</span>
          <span class="w-full p-2 outline-none text-left block">
            <label>
              <input v-model="form.type_id" type="radio" name="tag_id" :value="1" /> article
            </label>
            <label>
              <input v-model="form.type_id" type="radio" name="tag_id" :value="2" class="ml-2" /> image-text
            </label>
          </span>
        </label>
      </div>

      <template v-if="form.type_id == 1">
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">摘要：</span>
            <textarea v-model="form.summary" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="文章摘要" />
          </label>
        </div>
        <div class="mb-3">
          <TiptapEditor v-model="form.content" :auto-save-key="`post-edit-${postId}-form-summary`" />
        </div>
      </template>

      <template v-if="form.type_id == 2">
        <div class="mb-3">
          <span class="w-full p-3 text-left block">图片：</span>
          <multiple-image-upload v-model="form.images"></multiple-image-upload>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">描述：</span>
            <textarea v-model="form.description" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="图片描述" />
          </label>
        </div>
      </template>

      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 transition">保存</button>
        <router-link to="/post" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </div>
    <loading :loading="saving"></loading>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { fetchAllCategories, fetchAllPostTags, createPost, updatePost, fetchPostById } from '@/services/admin'
import type { Category, PostTag } from '@/types'
import Loading from "@/components/Loading.vue";
import { toast } from "@/composables/useToast.ts";
import MultipleImageUpload from "@/components/MultipleImageUpload.vue";
import CropperImageUpload from "@/components/CropperImageUpload.vue";

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.post_id)
const postId = isEdit ? route.params.post_id : 0

const form = reactive<{
  title: string,
  category_id: number,
  content: string,
  type_id: number,
  summary: string,
  cover: string,
  description: string,
  images: string[],
  tags: string[],
  is_show: string | number
}>({
  title: '',
  category_id: 0,
  content: '',
  type_id: 1,
  summary: '',
  cover: '',
  description: '',
  images: [],
  tags: [],
  is_show: 1
})

const categories = ref<Category[]>([])
const postTags = ref<PostTag[]>([])
const saving = ref(false)

onMounted(loadData)

async function loadData() {
  saving.value = true
  await fetchAllCategories().then(res => {
    categories.value = res.data.items
  })
  await fetchAllPostTags().then(res => {
    postTags.value = res.data.items
  })
  if (isEdit.value) {
    await fetchPostById(route.params.post_id as string).then(res => {
      const post = res.data
      if (post) {
        form.title = post.title
        form.type_id = post.type_id
        form.category_id = post.category_id
        form.summary = post.summary ? post.summary : ''
        form.content = post.content ? post.content : ''
        form.cover = post.cover ? post.cover : ''
        form.images = post.images ? post.images : []
        form.tags = post.tags ? post.tags : []
        form.is_show = post.is_show ? post.is_show : 1
      }
    })
  }
  saving.value = false
}

async function save() {
  const payload = { ...form }
  saving.value = true
  if (isEdit.value) {
    await updatePost(route.params.post_id as string, payload).then(() => {
      toast.success('编辑成功')
    }).catch(_e => {
      toast.error('编辑失败')
    })
  } else {
    await createPost(payload).then(res => {
      toast.success('添加成功')
      router.push(`/post/${res.data}/edit`)
    }).catch(_e => {
      toast.error('添加失败')
    })
  }
  saving.value = false
}
</script>