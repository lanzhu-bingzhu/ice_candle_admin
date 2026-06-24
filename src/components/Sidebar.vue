<template>
  <aside class="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col flex-shrink-0">
    <div class="p-6 text-2xl font-bold text-cyan-400">IceCandleAdmin</div>
    <nav class="flex-1 px-4 space-y-1">
      <router-link to="/" custom v-slot="{ navigate, isActive }">
        <button @click="navigate"
          :class="['flex items-center gap-2 w-full px-4 py-2 rounded-lg transition', isActive ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-white/10 text-slate-300']">
          <HomeIcon class="w-5 h-5" />
          仪表盘
        </button>
      </router-link>
      <router-link to="/post" custom v-slot="{ navigate, isActive }">
        <button @click="navigate"
          :class="['flex items-center gap-2 w-full px-4 py-2 rounded-lg transition', isActive ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-white/10 text-slate-300']">
          <DocumentTextIcon class="w-5 h-5" />
          文章管理
        </button>
      </router-link>
      <router-link to="/category" custom v-slot="{ navigate, isActive }">
        <button @click="navigate"
          :class="['flex items-center gap-2 w-full px-4 py-2 rounded-lg transition', isActive ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-white/10 text-slate-300']">
          <TagIcon class="w-5 h-5" />
          分类管理
        </button>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { HomeIcon, DocumentTextIcon, TagIcon } from '@heroicons/vue/24/outline'
</script>