<template>
  <div>
    <editor-content :editor="editor"></editor-content>
  </div>
</template>

<script setup lang="ts">
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import {onBeforeUnmount} from "vue";

const editor = useEditor({
  content: "<p>我正在用 Vue.js 运行 Tiptap。🎉</p>",
  extensions: [Document, Paragraph, Text, CodeBlock],
  editorProps: {
    attributes: {
      class: 'prose prose-slate max-w-none p-4 min-h-[300px] focus:outline-none text-left',
    },
  },
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>

</style>