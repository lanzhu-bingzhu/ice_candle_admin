<template>
  <div>
    <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
      <div v-if="modelValue.length" class="flex items-center gap-4 flex-wrap">
        <template v-for="(item, index) in modelValue">
          <div class="relative">
            <img :src="item" class="w-20 h-20 object-cover rounded" alt="已上传图片"/>
            <button @click="clearUpload(index)" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">
              <span class="icon-[iconoir--xmark]"></span>
            </button>
          </div>
        </template>
        <template v-if="!selectedFile">
          <div class="w-20 h-20 flex justify-center items-center border-2 border-dashed border-slate-300 rounded bg-slate-50 hover:border-ice-400 transition cursor-pointer" @click="triggerFileInput">
            <div class="text-center text-sm text-slate-500">
              <span class="w-6 h-6 icon-[iconoir--upload]"></span>
              <p>上传</p>
            </div>
          </div>
        </template>
        <template v-if="selectedFile && selectedFileUrl">
          <div class="flex flex-wrap items-center gap-3">
            <img :src="selectedFileUrl" class="w-20 h-20 object-cover rounded" alt="待上传图片"/>
            <button @click="uploadFile" :disabled="!selectedFile || uploading" class="px-4 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 disabled:opacity-50 transition text-sm">
              {{ uploading ? '上传中...' : '上传图片' }}
            </button>
            <button @click="cancelUploadFile" :disabled="!selectedFile || uploading" class="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 transition text-sm">
              {{ uploading ? '上传中...' : '取消' }}
            </button>
          </div>
        </template>
      </div>

      <template v-if="!selectedFile && !modelValue.length">
        <div class="w-20 h-20 flex justify-center items-center border-2 border-dashed border-slate-300 rounded bg-slate-50 hover:border-ice-400 transition cursor-pointer" @click="triggerFileInput">
          <div class="text-center text-sm text-slate-500">
            <span class="w-6 h-6 icon-[iconoir--upload]"></span>
            <p>上传</p>
          </div>
        </div>
      </template>

      <div class="my-3 text-left" v-if="uploadError">
        <span class="text-red-500 text-sm">{{ uploadError }}</span>
      </div>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/services/upload'
import { toast } from '@/composables/useToast'

const modelValue = defineModel<string[]>({ type: Array, default: [] })

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const selectedFileUrl = ref('')
const uploading = ref(false)
const uploadError = ref('')

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    selectedFileUrl.value = URL.createObjectURL(target.files[0])
    uploadError.value = ''
  }
}

function cancelUploadFile() {
  selectedFile.value = null
  selectedFileUrl.value = ''
}

async function uploadFile() {
  if (!selectedFile.value) return
  uploading.value = true
  uploadError.value = ''

  await uploadImage(selectedFile.value).then(res => {
    const result = res.data
    modelValue.value.push(result.url)
    // 清空文件选择
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
    selectedFileUrl.value = ''
    toast.success('上传成功')
  }).catch(e => {
    uploadError.value = e.message || '上传失败'
    toast.error(uploadError.value)
  }).finally(() => {
    uploading.value = false
  })
}

function clearUpload(index: number) {
  modelValue.value = modelValue.value.filter((_item, key) => key !== index)
}
</script>