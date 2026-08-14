<template>
  <aside class="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col flex-shrink-0">
    <div class="p-6 text-2xl font-bold text-cyan-400">IceCandleAdmin</div>
    <nav class="flex-1 px-4 space-y-1">
      <router-link v-for="item in list" :to="item.link" custom v-slot="{ navigate, isActive }">
        <button @click="navigate" :class="['flex text-sm items-center gap-2 w-full px-4 py-2 rounded transition', isActive ? 'bg-ice-500/20 text-ice-300' : 'hover:bg-white/10 text-slate-300']">
          {{ item.name }}
        </button>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";

const list: any = ref([
  { name: '仪表盘', link: '/home' },
  { name: '文章管理', link: '/post' },
  { name: '分类管理', link: '/category' },
  { name: '楼层管理', link: '/floor' },
  { name: '任务管理', link: '/task' },
  { name: '系统设置', link: '/setting' },
])
</script>