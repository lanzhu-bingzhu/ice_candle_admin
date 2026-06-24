<template>
  <div class="border border-slate-300 rounded-xl bg-white overflow-hidden">
    <div class="flex gap-1 p-2 border-b border-slate-200 bg-slate-50 flex-wrap" v-if="editor">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-blue-200': editor.isActive('bold') }"
        class="px-2 py-1 rounded text-sm font-bold">B</button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-blue-200': editor.isActive('italic') }"
        class="px-2 py-1 rounded text-sm italic">I</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-blue-200': editor.isActive('heading', { level: 2 }) }"
        class="px-2 py-1 rounded text-sm">H2</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-blue-200': editor.isActive('heading', { level: 3 }) }"
        class="px-2 py-1 rounded text-sm">H3</button>
      <button @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-blue-200': editor.isActive('bulletList') }" class="px-2 py-1 rounded text-sm">• 列表</button>
      <button @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-blue-200': editor.isActive('orderedList') }" class="px-2 py-1 rounded text-sm">1. 列表</button>
      <button @click="addImage" class="px-2 py-1 rounded text-sm hover:bg-slate-200">🖼️ 图片</button>
    </div>
    <editor-content :editor="editor" class="prose max-w-none p-4 min-h-[300px] focus:outline-none" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: '请输入文章内容...' }),
    Image,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, {})
  }
})

const addImage = () => {
  const url = window.prompt('请输入图片 URL')
  if (url && editor.value) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>