<template>
  <div>
    <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
      <div v-if="modelValue && !showCropper" class="flex items-center gap-4">
        <div class="flex-1 relative">
          <img :src="modelValue" class="w-full object-cover rounded" alt="已上传图片"/>
          <button @click="clearImage" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">
            <span class="icon-[iconoir--xmark]"></span>
          </button>
        </div>
      </div>

      <template v-if="!showCropper && !modelValue">
        <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 rounded bg-slate-50 hover:border-ice-400 transition cursor-pointer" @click="triggerFileInput">
          <div class="text-center text-sm text-slate-500">
            <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-1">点击选择图片</p>
            <p class="text-xs text-slate-400">支持 JPG、PNG、GIF</p>
          </div>
        </div>
      </template>

      <div v-if="showCropper" class="space-y-3">
        <div class="relative bg-slate-100 rounded overflow-hidden" style="height: 400px;">
          <VueCropper
              ref="cropperRef"
              :key="cropperImg"
              :img="cropperImg"
              :fixed-box="true"
              :auto-crop="true"
              :fixed="true"
              :fixed-number="fixedNumber"
              :auto-crop-height="400"
              :center-box="true"
              :can-move="true"
              :can-move-box="false"
              crop-box-border="1px solid #409EFF"
              mode="100%"
              :original="true"
              :full="true"
              :enlarge="2"
              :infoTrue="true"
          />
        </div>
        <div class="flex gap-3">
          <button @click="confirmCrop" :disabled="cropping" class="px-4 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 disabled:opacity-50 transition text-sm">
            {{ cropping ? '处理中...' : '裁剪并上传' }}
          </button>
          <button @click="cancelCrop" class="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 transition text-sm">取消</button>
        </div>
      </div>
    </div>

    <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueCropper } from 'vue-cropper'
import { uploadImage } from '@/services/upload'
import { toast } from '@/composables/useToast'

const modelValue = defineModel<string>()

const props = defineProps<{
  autoCropWidth?: string | number,
  autoCropHeight?: string | number
}>()

const fileInputRef = ref<HTMLInputElement>()
const cropperRef = ref<InstanceType<typeof VueCropper>>()
const cropperImg = ref('')
const showCropper = ref(false)
const cropping = ref(false)
const cropWidth = ref(props.autoCropWidth ?? 400)
const cropHeight = ref(props.autoCropHeight ?? 400)

const fixedNumber = computed(() => {
  let output = simplifyAspectRatio(cropWidth.value as number, cropHeight.value as number)
  return [output.width, output.height]
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0]
    cropperImg.value = URL.createObjectURL(file)
    showCropper.value = true
    input.value = ''
  }
}

function cancelCrop() {
  if (cropperImg.value) URL.revokeObjectURL(cropperImg.value)
  showCropper.value = false
  cropperImg.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function confirmCrop() {
  if (!cropperRef.value) {
    toast.error('裁剪组件未就绪')
    return
  }

  cropping.value = true
  try {
    const blob = await new Promise<Blob>((resolve) => {
      cropperRef.value?.getCropBlob((blob: Blob) => resolve(blob))
    })
    const file = new File([blob], `crop_${Date.now()}.png`, { type: 'image/png' })
    await uploadAndSet(file)
  } catch (error: any) {
    toast.error(error.message || '裁剪失败')
    cropping.value = false
  }
}

async function uploadAndSet(file: File) {
  try {
    const res = await uploadImage(file)
    modelValue.value = res.data.url
    if (cropperImg.value) URL.revokeObjectURL(cropperImg.value)
    showCropper.value = false
    cropperImg.value = ''
    toast.success('图片上传成功')
  } catch (error: any) {
    toast.error(error.message || '上传失败')
  } finally {
    cropping.value = false
  }
}

function clearImage() {
  modelValue.value = ''
}

/**
 * 计算两个正整数的最大公约数（欧几里得算法）
 */
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/**
 * 简化宽高比
 * @param width  宽度（正数）
 * @param height 高度（正数）
 * @returns 最简整数比对象 { width, height }
 * @throws 当宽或高为非正数时抛出错误
 */
function simplifyAspectRatio(width: number, height: number): {
  width: number;
  height: number;
} {
  if (width <= 0 || height <= 0) {
    throw new Error('宽度和高度必须为正数');
  }

  // 处理浮点数：将数值放大到整数再计算（保留 3 位小数精度）
  const precision = 1000;
  const w = Math.round(width * precision);
  const h = Math.round(height * precision);
  const divisor = gcd(w, h);

  return {
    width: w / divisor,
    height: h / divisor,
  };
}
</script>

<style scoped>
/* 如有需要可追加样式，不影响裁剪框显示 */
</style>