<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 animate-slide-in"
          :class="toastClasses(toast.type)"
      >
        <span class="text-lg">{{ iconMap[toast.type] }}</span>
        <span class="text-sm font-medium flex-1">{{ toast.text }}</span>
        <button @click="removeToast(toast.id)" class="text-current opacity-60 hover:opacity-100 transition">
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const iconMap: Record<string, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
}

function toastClasses(type: string) {
  const base = 'bg-white/90 text-slate-800 border-slate-200'
  const colored: Record<string, string> = {
    success: 'bg-emerald-50/90 text-emerald-800 border-emerald-300',
    error: 'bg-red-50/90 text-red-800 border-red-300',
    warning: 'bg-amber-50/90 text-amber-800 border-amber-300',
    info: 'bg-blue-50/90 text-blue-800 border-blue-300',
  }
  return colored[type] || base
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>