<template>
  <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm relative">
    <h2 class="text-lg font-bold text-slate-800 mb-6">{{ isEdit ? '编辑任务' : '新建任务' }}</h2>
    <div class="space-y-4 text-sm">
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">任务名：</span>
          <input v-model="form.name" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="任务名" />
        </label>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">任务标题：</span>
          <input v-model="form.title" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="任务标题" />
        </label>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">结束日期：</span>
          <input v-model="form.deadline" type="datetime-local" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="结束日期" />
        </label>
      </div>
      <div class="mb-3">
        <label>
          <span class="w-full p-3 text-left block">任务详情：</span>
          <TiptapEditor v-model="form.overall_description" :auto-save-key="`task-edit-${taskId}-form-overall-description`" />
        </label>
      </div>
      <div class="mb-3">
        <span class="w-full p-3 text-left block">头图：</span>
        <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="text-sm" />
            <button @click="uploadFile" :disabled="!selectedFile || uploading" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition text-sm">
              {{ uploading ? '上传中...' : '上传图片' }}
            </button>
            <span v-if="uploadError" class="text-red-500 text-sm">{{ uploadError }}</span>
          </div>
          <!-- 上传结果预览 -->
          <div v-if="form.header_image" class="flex items-center gap-4">
            <div class="relative">
              <img :src="form.header_image" class="w-20 h-20 object-cover rounded border" alt="已上传图片"/>
              <button @click="clearUpload" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">×</button>
            </div>
          </div>
        </div>
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
        <span class="w-full p-3 text-left block">
          子任务项：
          <button @click="addTaskNode" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition text-xs">
            添加
          </button>
        </span>
        <div v-if="form.task_nodes.length" class="border border-slate-300 rounded p-3 pl-5 pr-5">
          <template v-for="(_node, index) in form.task_nodes">
            <div class="mb-3">
              <span class="w-full p-3 text-left block">
                子任务 {{ index }}：
                <button @click="deleteTaskNode(index)" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition text-xs">
                  删除
                </button>
              </span>
            </div>
            <div class="border border-slate-300 rounded pl-2 pr-2 mb-3">
              <div class="mb-3">
                <label>
                  <span class="w-full p-3 text-left block">子任务标题：</span>
                  <input v-model="form.task_nodes[index].title" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="子任务标题" />
                </label>
              </div>
              <div class="mb-3">
                <label>
                  <span class="w-full p-3 text-left block">子任务描述：</span>
                  <input v-model="form.task_nodes[index].description" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="子任务描述" />
                </label>
              </div>
              <div class="mb-3">
                <label>
                  <span class="w-full p-3 text-left block">子任务详情：</span>
                  <TiptapEditor v-model="form.task_nodes[index].details" :auto-save-key="`task-edit-${taskId}-form-task_nodes-${index}-details`" />
                </label>
              </div>
              <div class="mb-3">
                <label>
                  <span class="w-full p-3 text-left block">子任务状态：</span>
                  <span class="w-full p-2 outline-none text-left block">
                    <label>
                      <input v-model="form.task_nodes[index].status_id" type="radio" :name="`task_nodes[${index}]status_id`" :value="1" /> pending
                    </label>
                    <label>
                      <input v-model="form.task_nodes[index].status_id" type="radio" :name="`task_nodes[${index}]status_id`" :value="2" class="ml-2" /> doing
                    </label>
                    <label>
                      <input v-model="form.task_nodes[index].status_id" type="radio" :name="`task_nodes[${index}]status_id`" :value="3" class="ml-2" /> done
                    </label>
                  </span>
                </label>
              </div>
              <div class="mb-3">
                <label>
                  <span class="w-full p-3 text-left block">子任务完成时间：</span>
                  <input v-model="form.task_nodes[index].completed_at" type="datetime-local" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="子任务完成时间" />
                </label>
              </div>
              <div class="mb-3">
                <span class="w-full p-3 text-left block">子任务结果：</span>
                <div class="border border-slate-300 rounded pl-2 pr-2">
                  <div class="mb-3">
                    <label>
                      <span class="w-full p-3 text-left block">文本：</span>
                      <input v-model="form.task_nodes[index].result.text" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="文本" />
                    </label>
                  </div>
                  <div class="mb-3">
                    <span class="w-full p-3 text-left block">图片：</span>
                    <div class="bg-slate-50 rounded p-4 border border-slate-200 space-y-3">
                      <div class="flex flex-wrap items-center gap-3">
                        <input ref="fileInput" type="file" accept="image/*" @change="handleResultFileChange" class="text-sm" />
                        <button @click="uploadResultFile(index)" :disabled="!selectedResultFile || uploadingResult" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition text-sm">
                          {{ uploadingResult ? '上传中...' : '上传图片' }}
                        </button>
                        <span v-if="uploadResultError" class="text-red-500 text-sm">{{ uploadError }}</span>
                      </div>
                      <!-- 上传结果预览 -->
                      <div v-if="form.task_nodes[index].result.images" class="flex items-center gap-4">
                        <template v-for="(item, index2) in form.task_nodes[index].result.images">
                          <div class="relative">
                            <img :src="item" class="w-20 h-20 object-cover rounded border" alt="已上传图片"/>
                            <button @click="clearResultUpload(index, index2)" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition" title="清除图片">×</button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="flex gap-4">
        <button @click="save" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">保存</button>
        <router-link to="/task" class="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">取消</router-link>
      </div>
    </div>
    <loading :loading="saving"></loading>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import { createTask, fetchTaskById, updateTask } from "@/services/admin.ts";
import TiptapEditor from '@/components/TiptapEditor.vue'
import { uploadImage } from "@/services/upload.ts";
import Loading from "@/components/Loading.vue";

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.task_id)
const taskId = isEdit ? route.params.task_id : 0
const saving = ref(false)

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const uploadedUrl = ref('')

const fileResultInput = ref<HTMLInputElement>()
const selectedResultFile = ref<File | null>(null)
const uploadingResult = ref(false)
const uploadResultError = ref('')
const uploadedResultUrl = ref('')

const form = reactive<{
  task_id: string | number,
  name: string,
  title: string,
  overall_description: string,
  header_image: string,
  deadline: string,
  task_nodes: {
    title: string,
    description: string,
    details: string,
    status_id: string | number
    completed_at: string
    result: {
      text: string,
      images: string[]
    }
  }[],
  is_show: string | number
}>({
  task_id: 0,
  name: '',
  title: '',
  overall_description: '',
  header_image: '',
  deadline: '',
  task_nodes: [],
  is_show: 1
})

onMounted(loadData)

async function loadData() {
  saving.value = true
  if (isEdit.value) {
    const task = await fetchTaskById(route.params.task_id as string)
    if (task) {
      form.name = task.name
      form.title = task.title
      form.overall_description = task.overall_description
      form.header_image = task.header_image
      form.deadline = task.deadline
      form.task_nodes = task.task_nodes
      form.is_show = task.is_show
    }
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

function handleResultFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedResultFile.value = target.files[0]
    uploadResultError.value = ''
  }
}

function clearUpload() {
  form.header_image = ''
}

function clearResultUpload(i: number, j: number) {
  form.task_nodes[i].result.images = form.task_nodes[i].result.images.filter((_item, index) => index !== j)
}

async function uploadFile() {
  if (!selectedFile.value) return
  uploading.value = true
  uploadError.value = ''
  try {
    const result = await uploadImage(selectedFile.value)
    uploadedUrl.value = result.url
    form.header_image = result.url
    // 清空文件选择
    if (fileInput.value) fileInput.value.value = ''
    selectedFile.value = null
  } catch (e: any) {
    uploadError.value = e.message || '上传失败'
  } finally {
    uploading.value = false
  }
}

async function uploadResultFile(i: number) {
  if (!selectedResultFile.value) return
  uploadingResult.value = true
  uploadResultError.value = ''
  try {
    const result = await uploadImage(selectedResultFile.value)
    uploadedResultUrl.value = result.url
    form.task_nodes[i].result.images.push(result.url)
    // 清空文件选择
    if (fileResultInput.value) fileResultInput.value.value = ''
    selectedResultFile.value = null
  } catch (e: any) {
    uploadResultError.value = e.message || '上传失败'
  } finally {
    uploadingResult.value = false
  }
}

async function addTaskNode() {
  form.task_nodes.push({
    title: '',
    description: '',
    details: '',
    status_id: 1,
    completed_at: '',
    result: {
      text: '',
      images: []
    }
  })
}

async function deleteTaskNode(index: number) {
  form.task_nodes = form.task_nodes.filter((_item, index2) => index !== index2)
}

const save = async () => {
  const payload = { ...form }
  saving.value = true
  if (isEdit.value) {
    await updateTask(route.params.task_id as string, payload)
  } else {
    const result = await createTask(payload)
    router.push(`/task/${result}/edit`)
  }
  saving.value = false
}
</script>

<style scoped>

</style>