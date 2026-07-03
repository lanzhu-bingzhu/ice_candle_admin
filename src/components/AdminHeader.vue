<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 flex items-center justify-end">
    <div class="flex items-center gap-4">
      <span class="text-sm text-slate-500">管理员</span>
      <button @click="logout" class="text-sm text-red-400 hover:text-red-600 transition">退出</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const logout = () => authStore.logout()
</script>