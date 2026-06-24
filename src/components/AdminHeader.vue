<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-2 flex items-center justify-end">
    <div class="flex items-center gap-4">
      <span class="text-sm text-slate-500">管理员</span>
      <button @click="logout" class="text-sm text-red-400 hover:text-red-600 transition">退出</button>
    </div>
  </header>
</template>

<script setup lang="ts">
const logout = () => {
  localStorage.removeItem('admin_token')
  window.location.href = '/login'
}
</script>