<template>
  <Transition>
    <div
        class="absolute inset-x-0 flex flex-col items-center justify-center bg-slate-300/60 backdrop-blur-sm transition-opacity duration-300 w-full h-full top-0"
        :class="props.loading ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <p class="text-white/90 text-lg font-medium">{{ props.text ? props.text : '加载中' }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{ loading: boolean, text?: string }>()
</script>