<template>
  <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm relative">
    <h2 class="text-lg font-bold text-slate-800 mb-6">{{ isEdit ? '编辑楼层' : '新建楼层' }}</h2>
    <div class="space-y-4 text-sm">
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">类型：</span>
          <span class="w-full p-2 outline-none text-left block">
            <label>
              <input v-model="form.type_id" type="radio" name="type_id" :value="1" /> article
            </label>
            <label>
              <input v-model="form.type_id" type="radio" name="type_id" :value="2" class="ml-2" /> image-text
            </label>
            <label>
              <input v-model="form.type_id" type="radio" name="type_id" :value="3" class="ml-2" /> banner
            </label>
          </span>
        </label>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">排序：</span>
          <input v-model="form.sort" type="number" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="排序" />
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

      <template v-if="form.type_id == 3">
        <div class="mb-3">
          <span class="w-full p-3 text-left block">图片：</span>
          <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="text-sm" />
              <button @click="uploadFile" :disabled="!selectedFile || uploading" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition text-sm">
                {{ uploading ? '上传中...' : '上传图片' }}
              </button>
              <span v-if="uploadError" class="text-red-500 text-sm">{{ uploadError }}</span>
            </div>
            <!-- 上传结果预览 -->
            <div v-if="form.image" class="flex items-center gap-4">
              <img :src="form.image" class="w-20 h-20 object-cover rounded border" alt="已上传图片"/>
              <button @click="clearUpload()" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">×</button>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">链接：</span>
            <input v-model="form.link" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="楼层链接" />
          </label>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">图片alt：</span>
            <input v-model="form.alt" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="图片alt" />
          </label>
        </div>
      </template>

      <template v-else>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">分类：</span>
            <select v-model="form.category_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none">
              <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
            </select>
          </label>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">标题：</span>
            <input v-model="form.title" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="楼层标题" />
          </label>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">描述：</span>
            <textarea v-model="form.description" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="楼层描述" />
          </label>
        </div>
      </template>

      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">保存</button>
        <router-link to="/floor" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </div>
    <loading :loading="saving"></loading>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import { createFloor, fetchCategories, fetchFloorById, updateFloor } from "@/services/admin.ts";
import type { Category } from "@/types";
import { uploadImage } from "@/services/upload.ts";
import Loading from "@/components/Loading.vue";

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.floor_id)

const form = reactive<{
  category_id: number | string,
  type_id: number | string,
  title: string,
  description: string,
  image: string,
  link: string,
  alt: string,
  sort: number,
  is_show: string | number
}>({
  category_id: 0,
  type_id: 1,
  title: '',
  description: '',
  image: '',
  link: '',
  alt: '',
  sort: 0,
  is_show: 1
})

const categories = ref<Category[]>([])
const saving = ref(false)

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const uploadedUrl = ref('')

onMounted(loadData)

async function loadData() {
  saving.value = true
  const data = await fetchCategories()
  categories.value = data.items
  if (isEdit.value) {
    const floor = await fetchFloorById(route.params.floor_id as string)
    if (floor) {
      form.title = floor.title
      form.type_id = floor.type_id
      form.category_id = floor.category_id
      form.description = floor.description ? floor.description : ''
      form.image = floor.image ? floor.image : ''
      form.link = floor.link ? floor.link : ''
      form.alt = floor.alt ? floor.alt : ''
      form.sort = floor.sort ? floor.sort : 0
      form.is_show = floor.is_show ? floor.is_show : 1
    }
  }
  saving.value = false
}

const save = async () => {
  const payload = { ...form }
  saving.value = true
  if (isEdit.value) {
    await updateFloor(route.params.floor_id as string, payload)
  } else {
    const result = await createFloor(payload)
    router.push(`/floor/${result}/edit`)
  }
  saving.value = false
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    uploadError.value = ''
  }
}

function clearUpload() {
  form.image = ''
}

async function uploadFile() {
  if (!selectedFile.value) return
  uploading.value = true
  uploadError.value = ''
  try {
    const result = await uploadImage(selectedFile.value)
    uploadedUrl.value = result.url
    form.image = uploadedUrl.value
    // 清空文件选择
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
  } catch (e: any) {
    uploadError.value = e.message || '上传失败'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>

</style>