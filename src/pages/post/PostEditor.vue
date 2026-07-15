<template>
  <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm">
    <h2 class="text-lg font-bold text-slate-800 mb-6">{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
    <div class="space-y-4 text-sm">
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
            <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
          </select>
        </label>
      </div>
      <div class="mb-3">
        <span class="w-full p-3 text-left block">封面图片：</span>
        <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <input ref="fileCoverInput" type="file" accept="image/*" @change="handleCoverFileChange" class="text-sm" />
            <button @click="uploadCoverFile" :disabled="!selectedCoverFile || uploadingCover" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition text-sm">
              {{ uploadingCover ? '上传中...' : '上传图片' }}
            </button>
            <span v-if="uploadCoverError" class="text-red-500 text-sm">{{ uploadCoverError }}</span>
          </div>
          <!-- 上传结果预览 -->
          <div v-if="form.cover" class="flex items-center gap-4">
            <div class="relative">
              <img :src="form.cover" class="w-20 h-20 object-cover rounded border" alt="已上传图片"/>
              <button @click="clearCoverUpload" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">×</button>
            </div>
          </div>
        </div>
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
              <input v-model="form.is_show" type="radio" name="tag_id" :value="1" /> 是
            </label>
            <label>
              <input v-model="form.is_show" type="radio" name="tag_id" :value="0" class="ml-2" /> 否
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
            <textarea v-model="form.summary" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="文章摘要" />
          </label>
        </div>
        <div class="mb-3">
          <TiptapEditor v-model="form.content" :auto-save-key="`post-edit-${postId}-form-summary`" />
        </div>
      </template>

      <template v-if="form.type_id == 2">
        <div class="mb-3">
          <span class="w-full p-3 text-left block">图片：</span>
          <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="text-sm" />
              <button @click="uploadMediaFile" :disabled="!selectedFile || uploading" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition text-sm">
                {{ uploading ? '上传中...' : '上传图片' }}
              </button>
              <span v-if="uploadError" class="text-red-500 text-sm">{{ uploadError }}</span>
            </div>
            <!-- 上传结果预览 -->
            <div v-if="form.images" class="flex items-center gap-4">
              <template v-for="(item, index) in form.images">
                <div class="relative">
                  <img :src="item" class="w-20 h-20 object-cover rounded border" alt="已上传图片"/>
                  <button @click="clearUpload(index)" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">×</button>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">描述：</span>
            <textarea v-model="form.description" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="图片描述" />
          </label>
        </div>
      </template>

      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">保存</button>
        <router-link to="/post" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { fetchAllCategories, fetchAllPostTags, createPost, updatePost, fetchPostById } from '@/services/admin'
import type { Category, PostTag } from '@/types'
import { uploadImage } from "@/services/upload.ts";

const route = useRoute()
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

const fileCoverInput = ref<HTMLInputElement>()
const selectedCoverFile = ref<File | null>(null)
const uploadingCover = ref(false)
const uploadCoverError = ref('')
const uploadedCoverUrl = ref('')

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const uploadedUrl = ref('')

onMounted(async () => {
  const allCategory = await fetchAllCategories()
  categories.value = allCategory.items
  const allPostTag = await fetchAllPostTags()
  postTags.value = allPostTag.items
  if (isEdit.value) {
    const post = await fetchPostById(route.params.post_id as string)
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
  }
})

function handleCoverFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedCoverFile.value = target.files[0]
    uploadCoverError.value = ''
  }
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    uploadError.value = ''
  }
}

function clearCoverUpload() {
  form.cover = ''
}


function clearUpload(index: number) {
  form.images = form.images.filter((_item, key) => key !== index)
}

async function uploadCoverFile() {
  if (!selectedCoverFile.value) return
  uploadingCover.value = true
  uploadCoverError.value = ''
  try {
    const result = await uploadImage(selectedCoverFile.value)
    uploadedCoverUrl.value = result.url
    form.cover = uploadedCoverUrl.value
    // 清空文件选择
    if (fileCoverInput.value) fileCoverInput.value.value = ''
    selectedCoverFile.value = null
  } catch (e: any) {
    uploadCoverError.value = e.message || '上传失败'
  } finally {
    uploadingCover.value = false
  }
}

async function uploadMediaFile() {
  if (!selectedFile.value) return
  uploading.value = true
  uploadError.value = ''
  try {
    const result = await uploadImage(selectedFile.value)
    uploadedUrl.value = result.url
    form.images.push(uploadedUrl.value)
    // 清空文件选择
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
  } catch (e: any) {
    uploadError.value = e.message || '上传失败'
  } finally {
    uploading.value = false
  }
}

const save = async () => {
  const payload = { ...form }
  if (isEdit.value) {
    await updatePost(route.params.post_id as string, payload)
  } else {
    await createPost(payload)
  }
}
</script>