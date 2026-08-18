<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e8f4fd] to-[#f9fcff]">
    <div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-200">
      <h1 class="text-2xl font-bold text-center text-slate-800 mb-2">IceCandleAdmin</h1>
      <p class="text-center text-slate-500 mb-8">登录后台管理系统</p>
      <form @submit.prevent="handleLogin" class="space-y-4 text-sm">
        <div>
          <label class="block text-left font-medium text-slate-600 mb-1">用户名：</label>
          <input v-model="form.username" type="text" class="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="请输入用户名" required />
        </div>
        <div>
          <label class="block text-left font-medium text-slate-600 mb-1">密码：</label>
          <input v-model="form.password" type="password" class="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-ice-400 outline-none" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="w-full py-3 bg-ice-500 text-white rounded hover:bg-ice-600 transition disabled:opacity-50" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from "@/composables/useToast.ts";

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: '',
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  await authStore.login(form).then(_res => {
    toast.success('登录成功')
  }).catch(e => {
    error.value = e?.response?.data?.message || '登录失败，请检查用户名和密码'
    toast.error(error.value)
  }).finally(() => {
    loading.value = false
  })
}
</script>