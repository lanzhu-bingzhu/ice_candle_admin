<template>
  <div class="flex h-screen bg-gradient-to-b from-[#e8f4fd] to-[#f9fcff] text-slate-800">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 右侧区域 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <AdminHeader />
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import AdminHeader from '@/components/AdminHeader.vue'
</script>