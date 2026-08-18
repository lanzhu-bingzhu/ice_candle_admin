<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 animate-slide-in"
          :class="toastClasses(toast.type)"
      >
        <span class="text-lg">
          <template v-if="'success' == toast.type">
            <span class="icon-[iconoir--check-square-solid]"></span>
          </template>
          <template v-if="'error' == toast.type">
            <span class="icon-[iconoir--xmark-square-solid]"></span>
          </template>
          <template v-if="'warning' == toast.type">
            <span class="icon-[iconoir--warning-square-solid]"></span>
          </template>
          <template v-if="'info' == toast.type">
            <span class="icon-[iconoir--info-circle-solid]"></span>
          </template>
        </span>
        <span class="text-sm font-medium flex-1">{{ toast.text }}</span>
        <button @click="remove(toast.id)" class="text-current opacity-60 hover:opacity-100 transition">
          <span class="icon-[iconoir--xmark]"></span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { toast } from "@/composables/useToast.ts";

const { toasts, remove } = toast

// const iconMap: Record<string, string> = {
//   success: '✅',
//   error: '❌',
//   warning: '⚠️',
//   info: 'ℹ️',
// }

function toastClasses(type: string) {
  const base = 'bg-white/90 text-slate-800 border-slate-200'
  const colored: Record<string, string> = {
    success: 'bg-emerald-50/90 text-emerald-800 border-emerald-300',
    error: 'bg-red-50/90 text-red-800 border-red-300',
    warning: 'bg-amber-50/90 text-amber-800 border-amber-300',
    info: 'bg-ice-50/90 text-ice-800 border-ice-300',
  }
  return colored[type] || base
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 3s ease-out;
}
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  15% {
    opacity: 1;
    transform: translateX(0%);
  }
  88% {
    opacity: 1;
    transform: translateX(0%);
  }
  98% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>