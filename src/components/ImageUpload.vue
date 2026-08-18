<template>
  <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
    <div class="flex flex-wrap items-center gap-3">
      <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="text-sm" />
      <template v-if="selectedFile">
        <button @click="uploadFile" :disabled="!selectedFile || uploading" class="px-4 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 disabled:opacity-50 transition text-sm">
          {{ uploading ? '上传中...' : '上传图片' }}
        </button>
      </template>
      <span v-if="uploadError" class="text-red-500 text-sm">{{ uploadError }}</span>
    </div>

    <!-- 上传结果预览 -->
    <template v-if="'object' === typeof modelValue">
      <div v-if="modelValue.length" class="flex items-center gap-4">
        <template v-for="(item, index) in modelValue">
          <div class="relative">
            <img :src="item" class="w-20 h-20 object-cover rounded border" alt="已上传图片"/>
            <button @click="clearUpload(index)" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">×</button>
          </div>
        </template>
      </div>
    </template>

    <template v-else>
      <div v-if="modelValue" class="flex items-center gap-4">
        <div class="relative">
          <img :src="modelValue" class="w-20 h-20 object-cover rounded border" alt="已上传图片"/>
          <button @click="clearUpload()" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">×</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/services/upload'
import { toast } from '@/composables/useToast'

const modelValue = defineModel<string | string[]>()

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadError = ref('')

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    uploadError.value = ''
  }
}

function clearUpload(index?: number) {
  if ('object' === typeof modelValue.value) {
    modelValue.value = modelValue.value.filter((_item, key) => key !== index)
  } else {
    modelValue.value = ''
  }
}

async function uploadFile() {
  if (!selectedFile.value) return
  uploading.value = true
  uploadError.value = ''

  await uploadImage(selectedFile.value).then(res => {
    const result = res.data
    if ('object' === typeof modelValue.value) {
      modelValue.value.push(result.url)
    } else {
      modelValue.value = result.url
    }
    // 清空文件选择
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
  }).catch(e => {
    uploadError.value = e.message || '上传失败'
    toast.error(uploadError.value)
  }).finally(() => {
    uploading.value = false
  })
}
</script>