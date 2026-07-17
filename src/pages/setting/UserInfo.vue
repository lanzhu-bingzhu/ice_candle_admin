<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-slate-800">系统设置</h2>
    </div>
    <div class="bg-white/80 border border-slate-200 rounded-lg p-6 shadow-sm relative">
      <h3 class="text-left font-bold text-slate-800 mb-6">管理员信息</h3>
      <div class="space-y-4 text-sm">
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">管理员名称：</span>
            <span class="columns-2 block">
            <input v-model="form.username" disabled class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="输入管理员名称"/>
          </span>
          </label>
        </div>
        <div class="mb-3">
          <label>
            <span class="w-full p-3 text-left block">管理员密码：</span>
            <span class="columns-2 block">
            <input v-model="form.password" type="password" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="输入新的密码"/>
            <button @click="handleResetPassword" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition block">重置密码</button>
          </span>
          </label>
        </div>
      </div>
      <loading :loading="loading"></loading>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from "@/stores/auth.ts"
import Loading from "@/components/Loading.vue";

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: '',
})

async function loadData() {
  if (authStore.user) {
    form.username = authStore.user.name
  }
}

async function handleResetPassword() {
  loading.value = true
  error.value = ''
  try {
    await authStore.resetPassword(form)
  } catch (e: any) {
    error.value = e?.response?.data?.message
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>

</style>