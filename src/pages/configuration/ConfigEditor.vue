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
        <span class="w-full p-3 text-left block">推荐：</span>
        <div class="border border-slate-300 rounded p-3 pl-5 pr-5">
          <div class="mb-3">
            <span class="w-full p-3 text-left block">推荐组图：</span>
            <multiple-image-upload v-model="form.recommendations_image"></multiple-image-upload>
          </div>
          <template v-if="form.recommendations_content.length > 0">
            <div class="mb-3">
              <span class="w-full p-3 text-left block">推荐内容：</span>
              <div class="space-y-3">
                <template v-for="(_item, index) in form.recommendations_content">
                  <div class="relative border border-slate-300 rounded p-3 pl-5 pr-5">
                    <button @click="deleteRecommendationsContent(index)" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">
                      <span class="icon-[iconoir--xmark]"></span>
                    </button>
                    <div class="mb-3">
                      <label>
                        <span class="w-full p-3 text-left block">标题：</span>
                        <input v-model="form.recommendations_content[index].title" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="标题" />
                      </label>
                    </div>
                    <div class="mb-3">
                      <label>
                        <span class="w-full p-3 text-left block">描述：</span>
                        <textarea v-model="form.recommendations_content[index].description" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="描述"></textarea>
                      </label>
                    </div>
                    <div class="mb-3">
                      <span class="w-full p-3 text-left block">图片：</span>
<!--                      <image-upload v-model="form.recommendations_content[index].image"></image-upload>-->
                      <cropper-image-upload auto-crop-width="1584" auto-crop-height="270" v-model="form.recommendations_content[index].image"></cropper-image-upload>
                    </div>
                    <div class="mb-3">
                      <label>
                        <span class="w-full p-3 text-left block">链接：</span>
                        <input v-model="form.recommendations_content[index].link" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="链接" />
                      </label>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <div class="flex justify-center px-6 pt-5 pb-6 my-3 border-2 border-dashed border-slate-300 rounded bg-slate-50 hover:border-ice-400 transition cursor-pointer" @click="addRecommendationsContent">
            <div class="text-center text-sm text-slate-500">
              <span class="icon-[iconoir--plus] w-12 h-12"></span>
              <p class="mt-1">点击添加推荐内容</p>
            </div>
          </div>
        </div>
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
import MultipleImageUpload from "@/components/MultipleImageUpload.vue";
import TiptapEditor from '@/components/TiptapEditor.vue'
import { fetchConfig, createConfig } from "@/services/admin.ts";
import { toast } from "@/composables/useToast.ts";
import CropperImageUpload from "@/components/CropperImageUpload.vue";

const form = reactive<{
  header_image: string,
  navigation_image: string,
  recommendations_image: string[],
  recommendations_content: {
    title: string
    description: string
    image: string
    link: string
  }[],
  introduction_image: string,
  introduction_text: string,
  test_image: string,
}>({
  header_image: '',
  navigation_image: '',
  recommendations_image: [],
  recommendations_content: [],
  introduction_image: '',
  introduction_text: '',
  test_image: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

async function loadData() {
  loading.value = true
  error.value = null
  await fetchConfig().then(res => {
    const config = res.data.items
    if (config) {
      form.header_image = config.header_image ?? ''
      form.navigation_image = config.navigation_image ?? ''
      form.recommendations_image = config.recommendations_image ?? []
      form.recommendations_content = config.recommendations_content ?? []
      form.introduction_image = config.introduction_image ?? ''
      form.introduction_text = config.introduction_text ?? ''
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

function addRecommendationsContent() {
  form.recommendations_content.push({
    title: '',
    description: '',
    image: '',
    link: ''
  })
}

function deleteRecommendationsContent(index: number) {
  form.recommendations_content = form.recommendations_content.filter((_item, index2) => index !== index2)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>

</style>