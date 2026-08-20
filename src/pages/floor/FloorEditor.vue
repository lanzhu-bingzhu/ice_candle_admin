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
          <input v-model="form.sort" type="number" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="排序" />
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
          <image-upload v-model="form.image"></image-upload>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">链接：</span>
            <input v-model="form.link" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="楼层链接" />
          </label>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">图片alt：</span>
            <input v-model="form.alt" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="图片alt" />
          </label>
        </div>
      </template>

      <template v-else>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">分类：</span>
            <select v-model="form.category_id" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none">
              <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">{{ cat.name }}</option>
            </select>
          </label>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">标题：</span>
            <input v-model="form.title" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="楼层标题" />
          </label>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">描述：</span>
            <textarea v-model="form.description" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="楼层描述" />
          </label>
        </div>
      </template>

      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-ice-500 text-white rounded hover:bg-ice-600 transition">保存</button>
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
import Loading from "@/components/Loading.vue";
import ImageUpload from "@/components/ImageUpload.vue";
import { toast } from "@/composables/useToast.ts";

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

onMounted(loadData)

async function loadData() {
  saving.value = true

  await fetchCategories().then(res => {
    categories.value = res.data.items
    if (isEdit.value) {
      fetchFloorById(route.params.floor_id as string).then(res => {
        if (res.data) {
          form.title = res.data.title
          form.type_id = res.data.type_id
          form.category_id = res.data.category_id
          form.description = res.data.description ? res.data.description : ''
          form.image = res.data.image ? res.data.image : ''
          form.link = res.data.link ? res.data.link : ''
          form.alt = res.data.alt ? res.data.alt : ''
          form.sort = res.data.sort ? res.data.sort : 0
          form.is_show = res.data.is_show ? res.data.is_show : 1
        }
      })
    }
  })

  saving.value = false
}

async function save() {
  const payload = { ...form }
  saving.value = true

  if (isEdit.value) {
    await updateFloor(route.params.floor_id as string, payload).then(_res => {
      toast.success('编辑成功')
    }).catch(_e => {
      toast.error('编辑失败')
    })
  } else {
    await createFloor(payload).then(res => {
      toast.success('添加成功')
      router.push(`/floor/${res.data}/edit`)
    }).catch(_e => {
      toast.error('添加失败')
    })
  }

  saving.value = false
}
</script>

<style scoped>

</style>