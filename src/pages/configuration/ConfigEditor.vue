<template>
  <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm relative">
    <h2 class="text-lg font-bold text-slate-800 mb-6">网站配置</h2>
    <div class="space-y-4 text-sm">
      <div class="mb-3">
        <span class="w-full p-3 text-left block">网站头图：</span>
        <image-upload v-model="form.header_image"></image-upload>
      </div>
      <div class="mb-3">
        <span class="w-full p-3 text-left block">导航配图：</span>
        <image-upload v-model="form.navigation_image"></image-upload>
      </div>
      <div class="mb-3">
        <span class="w-full p-3 text-left block">推荐组图：</span>
        <image-upload v-model="form.recommendations_image"></image-upload>
      </div>
      <div class="mb-3">
        <span class="w-full p-3 text-left block">介绍配图：</span>
        <image-upload v-model="form.introduction_image"></image-upload>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">网站介绍：</span>
          <TiptapEditor v-model="form.introduction_text" :auto-save-key="`config-form-introduction_text`" />
        </label>
      </div>
      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 transition">保存</button>
        <router-link to="/category" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import Loading from "@/components/Loading.vue";
import ImageUpload from "@/components/ImageUpload.vue";
import TiptapEditor from '@/components/TiptapEditor.vue'
import { fetchConfig, createConfig } from "@/services/admin.ts";
import { toast } from "@/composables/useToast.ts";

const form = reactive<{
  header_image: string,
  navigation_image: string,
  recommendations_image: string[],
  introduction_image: string,
  introduction_text: string,
}>({
  header_image: '',
  navigation_image: '',
  recommendations_image: [],
  introduction_image: '',
  introduction_text: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  await fetchConfig().then(res => {
    const config = res.data.items
    if (config) {
      config.forEach(item => {
        if ('header_image' == item.name) {
          form.header_image = item.value
        }
        if ('navigation_image' == item.name) {
          form.navigation_image = item.value
        }
        if ('recommendations_image' == item.name) {
          form.recommendations_image = item.value
        }
        if ('introduction_image' == item.name) {
          form.introduction_image = item.value
        }
        if ('introduction_text' == item.name) {
          form.introduction_text = item.value
        }
      })
    }
  }).catch(e => {
    error.value = e.message || '加载配置失败'
    toast.error(error.value || '加载配置失败')
  }).finally(() => {
    loading.value = false
  })
}

async function save() {
  const payload = { ...form }
  loading.value = true
  await createConfig(payload).then(() => {
    toast.success('更改配置成功')
  }).catch(_e => {
    toast.error('更改配置失败')
  }).finally(() => {
    loadData()
    loading.value = false
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>

</style>