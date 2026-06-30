<template>
  <div
      class="border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm"
      :class="{ 'fixed inset-0 z-50 rounded-none': isFullscreen }"
  >
    <!-- 工具栏 -->
    <div
        v-if="editor"
        class="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30"
    >
      <!-- 文本格式 -->
      <div class="flex items-center gap-0.5">
        <button
            @click="editor.chain().focus().toggleBold().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('bold') }"
            title="加粗"
        >
          <b>B</b>
        </button>
        <button
            @click="editor.chain().focus().toggleItalic().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent italic"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('italic') }"
            title="斜体"
        >
          I
        </button>
        <button
            @click="editor.chain().focus().toggleUnderline().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent underline"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('underline') }"
            title="下划线"
        >
          U
        </button>
        <button
            @click="editor.chain().focus().toggleStrike().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent line-through"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('strike') }"
            title="删除线"
        >
          S
        </button>
        <button
            @click="editor.chain().focus().toggleSubscript().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('subscript') }"
            title="下标"
        >
          x₂
        </button>
        <button
            @click="editor.chain().focus().toggleSuperscript().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('superscript') }"
            title="上标"
        >
          x²
        </button>
        <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('heading', { level: 1 }) }"
            title="H1"
        >
          H1
        </button>
        <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('heading', { level: 2 }) }"
            title="H2"
        >
          H2
        </button>
        <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('heading', { level: 3 }) }"
            title="H3"
        >
          H3
        </button>
        <button
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('heading', { level: 4 }) }"
            title="H4"
        >
          H4
        </button>
        <input type="color" :value="currentColor" @input="setColor" class="w-6 h-6 rounded cursor-pointer" title="文字颜色" />
        <input type="color" :value="currentBgColor" @input="setBackground" class="w-6 h-6 rounded cursor-pointer" title="背景色" />
        <select v-model="currentFontFamily" @change="setFontFamily" class="text-xs py-0.5 px-1 rounded border border-slate-300">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
        </select>
        <select v-model="currentFontSize" @change="setFontSize" class="text-xs py-0.5 px-1 rounded border border-slate-300 w-14">
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="22px">22</option>
          <option value="24px">24</option>
          <option value="26px">26</option>
        </select>
      </div>
      <button @click="clearFormatting"
        class="px-2 py-1 text-xs rounded hover:bg-red-100 transition-colors cursor-pointer border border-transparent"
        title="清除格式">
        🧹 清除
      </button>

      <div class="w-px h-6 bg-slate-300 mx-1"></div>

      <!-- 段落 -->
      <div class="flex items-center gap-0.5">
        <button
            @click="editor.chain().focus().setTextAlign('left').run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive({ textAlign: 'left' }) }"
            title="左对齐"
        >
          <bars3-bottom-left-icon class="w-4 h-4" />
        </button>
        <button
            @click="editor.chain().focus().setTextAlign('center').run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive({ textAlign: 'center' }) }"
            title="居中"
        >
          <bars3-icon class="w-4 h-4" />
        </button>
        <button
            @click="editor.chain().focus().setTextAlign('right').run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive({ textAlign: 'right' }) }"
            title="右对齐"
        >
          <bars3-bottom-right-icon class="w-4 h-4" />
        </button>
        <button
            @click="editor.chain().focus().setTextAlign('justify').run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive({ textAlign: 'justify' }) }"
            title="两端对齐"
        >
          <bars4-icon class="w-4 h-4" />
        </button>
        <select v-model="currentLineHeight" @change="setLineHeight" class="text-xs py-0.5 px-1 rounded border border-slate-300 w-14">
          <option value="1">1.0</option>
          <option value="1.5">1.5</option>
          <option value="2">2.0</option>
          <option value="2.5">2.5</option>
          <option value="3">3.0</option>
        </select>
      </div>

      <div class="w-px h-6 bg-slate-300 mx-1"></div>

      <!-- 列表/引用/水平线 -->
      <div class="flex items-center gap-0.5">
        <button
            @click="editor.chain().focus().toggleBulletList().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('bulletList') }"
            title="无序列表"
        >
          •
        </button>
        <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('orderedList') }"
            title="有序列表"
        >
          1.
        </button>
        <button
            @click="editor.chain().focus().toggleBlockquote().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('blockquote') }"
            title="引用"
        >
          ❝
        </button>
        <button
            @click="editor.chain().focus().setHorizontalRule().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="分割线"
        >
          —
        </button>
      </div>

      <div class="w-px h-6 bg-slate-300 mx-1"></div>

      <!-- 链接与媒体 -->
      <div class="flex items-center gap-0.5">
        <button @click="setLink" class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent" title="插入链接">🔗</button>
        <button @click="addImage" class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent" title="插入图片">🖼️</button>
<!--        <button @click="addVideo" class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent" title="插入视频">🎬</button>-->
      </div>

      <div class="w-px h-6 bg-slate-300 mx-1"></div>

      <!-- 表格 -->
      <div class="flex items-center gap-0.5">
        <button
            @click="editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="插入表格"
        >
          ⊞
        </button>
        <button
            @click="editor.chain().focus().addColumnBefore().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="前插列"
        >
          ◀|
        </button>
        <button
            @click="editor.chain().focus().addColumnAfter().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="后插列"
        >
          |▶
        </button>
        <button
            @click="editor.chain().focus().addRowBefore().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="前插行"
        >
          ▲
        </button>
        <button
            @click="editor.chain().focus().addRowAfter().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="后插行"
        >
          ▼
        </button>
        <button
            @click="editor.chain().focus().deleteRow().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="删除行"
        >
          ✕
        </button>
        <button
            @click="editor.chain().focus().deleteColumn().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="删除列"
        >
          ✕
        </button>
      </div>

      <div class="w-px h-6 bg-slate-300 mx-1"></div>

      <!-- 代码块 & 公式 -->
      <div class="flex items-center gap-0.5">
        <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            :class="{ 'bg-blue-200 border-blue-300': editor.isActive('codeBlock') }"
            title="代码块"
        >
          &lt;/&gt;
        </button>
        <button
            @click="toggleMath"
            class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent"
            title="公式"
        >
          √
        </button>
      </div>

      <div class="w-px h-6 bg-slate-300 mx-1"></div>

      <!-- 撤销/重做 -->
      <div class="flex items-center gap-0.5">
        <button @click="editor.chain().focus().undo().run()" class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent" title="撤销">↩</button>
        <button @click="editor.chain().focus().redo().run()" class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent" title="重做">↪</button>
      </div>

      <div class="ml-auto flex items-center gap-1">
        <button @click="toggleSourceCode" class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent" title="源码">HTML</button>
        <button @click="toggleFullscreen" class="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors cursor-pointer border border-transparent" title="全屏">⛶</button>
      </div>
    </div>

    <!-- 源码模式 -->
    <textarea
        v-if="isSourceMode"
        v-model="htmlSource"
        class="w-full p-4 min-h-[400px] font-mono text-sm focus:outline-none"
        @blur="applySource"
    ></textarea>

    <!-- 编辑器内容 -->
    <editor-content v-else :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, onMounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle, FontSize, LineHeight } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Link from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import CharacterCount from '@tiptap/extension-character-count'
import Italic from '@tiptap/extension-italic'
import { Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3Icon, Bars4Icon } from '@heroicons/vue/24/outline'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const isFullscreen = ref(false)
const isSourceMode = ref(false)
const htmlSource = ref('')

const DEFAULT_TEXT_STYLE = {
  fontSize: '16px',
  color: '#334155',      // slate-700
  fontFamily: 'Arial',
  lineHeight: '1.5',
  backgroundColor: '#ffffff',
}

const currentFontSize = ref(DEFAULT_TEXT_STYLE.fontSize)
const currentFontFamily = ref(DEFAULT_TEXT_STYLE.fontFamily)
const currentColor = ref(DEFAULT_TEXT_STYLE.color)
const currentLineHeight = ref(DEFAULT_TEXT_STYLE.lineHeight)
const currentBgColor = ref(DEFAULT_TEXT_STYLE.backgroundColor)

// 自动保存 key
const AUTO_SAVE_KEY = 'editor-autosave'

// 编辑器实例
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: false, // 使用 lowlight 版本
    }),
    Placeholder.configure({ placeholder: '开始创作...' }),
    Underline,
    Strike,
    Subscript,
    Superscript,
    TextAlign.configure({ types: ['heading', 'paragraph', 'codeBlock'] }),
    Color,
    Highlight.configure({ multicolor: true }),
    TextStyle,
    FontSize,
    LineHeight,
    FontFamily.configure({ types: ['textStyle'] }),
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-500 underline' } }),
    ImageExt.configure({ inline: true }),
    Youtube.configure({ controls: true }),
    Table.configure({ resizable: true }),
    TableHeader,
    TableRow,
    TableCell,
    CodeBlock.configure({ enableTabIndentation: true, HTMLAttributes: { class: 'custom-code-block' } }),
    HorizontalRule,
    CharacterCount,
    Italic,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-slate max-w-none p-4 min-h-[400px] focus:outline-none text-left',
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
  }
})

// 同步外部 v-model
watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, {})
  }
})

// 颜色设置
const setColor = (e: Event) => {
  const color = (e.target as HTMLInputElement).value
  editor.value?.chain().focus().setColor(color).run()
}
const setBackground = (e: Event) => {
  const color = (e.target as HTMLInputElement).value
  editor.value?.chain().focus().setHighlight({ color }).run()
  currentBgColor.value = color
}
const setFontFamily = (e: Event) => {
  const font = (e.target as HTMLSelectElement).value
  if (font) editor.value?.chain().focus().setFontFamily(font).run()
  else editor.value?.chain().focus().unsetFontFamily().run()
}
const setFontSize = (e: Event) => {
  const size = (e.target as HTMLSelectElement).value
  if (size) editor.value?.commands.setFontSize(size)
}
const setLineHeight = (e: Event) => {
  const height = (e.target as HTMLSelectElement).value
  if (height) editor.value?.commands.setLineHeight(height)
}
const clearFormatting = () => {
  editor.value?.chain().focus().unsetAllMarks().clearNodes().run()
}

// 链接
const setLink = () => {
  const url = window.prompt('输入链接 URL')
  if (url) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

const addImage = () => {
  const url = window.prompt('输入图片 URL')
  if (url) editor.value?.chain().focus().setImage({ src: url }).run()
}
// const addVideo = () => {
//   const url = window.prompt('输入 YouTube 视频 URL')
//   if (url) editor.value?.chain().focus().setYoutubeVideo({ src: url }).run()
// }
const toggleMath = () => {
  // 简单插入 LaTeX 占位符，可以进一步完善
  const math = window.prompt('输入 LaTeX 公式')
  if (math) {
    editor.value?.chain().focus().insertContent(`\\(${math}\\)`).run()
  }
}

// 源码编辑
const toggleSourceCode = () => {
  isSourceMode.value = !isSourceMode.value
  if (isSourceMode.value) {
    htmlSource.value = editor.value?.getHTML() || ''
  } else {
    applySource()
  }
}
const applySource = () => {
  if (editor.value && !isSourceMode.value) return
  editor.value?.commands.setContent(htmlSource.value)
  isSourceMode.value = false
}

// 全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 自动保存（防抖）
let autoSaveTimer: number | null = null
watch(() => editor.value?.getHTML(), (val) => {
  if (!val) return
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = window.setTimeout(() => {
    localStorage.setItem(AUTO_SAVE_KEY, val)
  }, 1000)
})

// 恢复草稿
onMounted(() => {
  const draft = localStorage.getItem(AUTO_SAVE_KEY)
  if (draft && editor.value && editor.value.getHTML() === '<p></p>') {
    editor.value.commands.setContent(draft)
  }

  if (editor.value) {
    editor.value.on('selectionUpdate', () => {
      const style = getCurrentTextStyle()
      currentFontSize.value = style.fontSize
      currentFontFamily.value = style.fontFamily
      currentColor.value = style.color
      currentLineHeight.value = style.lineHeight
      currentBgColor.value = style.backgroundColor
    })
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function getCurrentTextStyle() {
  if (!editor.value) return { ...DEFAULT_TEXT_STYLE }
  const textAttrs = editor.value.getAttributes('textStyle')
  const highlightAttrs = editor.value.getAttributes('highlight')
  return {
    fontSize: textAttrs.fontSize || DEFAULT_TEXT_STYLE.fontSize,
    color: textAttrs.color || DEFAULT_TEXT_STYLE.color,
    fontFamily: textAttrs.fontFamily || DEFAULT_TEXT_STYLE.fontFamily,
    lineHeight: textAttrs.lineHeight || DEFAULT_TEXT_STYLE.lineHeight,
    backgroundColor: highlightAttrs.color || DEFAULT_TEXT_STYLE.backgroundColor,
  }
}
</script>

<style scoped>
/* ========== 基础容器 ========== */
:deep(.ProseMirror) {
  min-height: 400px;
  outline: none;
}

/* ========== 标题 ========== */
:deep(.ProseMirror h1) {
  font-size: 2rem;
  font-weight: 700;
  /* margin: 1.5rem 0 1rem; */
  color: #1e293b; /* slate-800 */
}
:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 600;
  /* margin: 1.25rem 0 0.75rem; */
  color: #1e293b;
}
:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 600;
  /* margin: 1rem 0 0.5rem; */
  color: #334155; /* slate-700 */
}
:deep(.ProseMirror h4),
:deep(.ProseMirror h5),
:deep(.ProseMirror h6) {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.75rem 0 0.5rem;
  color: #475569; /* slate-600 */
}

/* ========== 段落 ========== */
:deep(.ProseMirror p) {
  /* margin: 0.75rem 0;
  line-height: 1.75; */
  color: #334155;
}

/* ========== 链接 ========== */
:deep(.ProseMirror a) {
  color: #0ea5e9; /* sky-500 */
  text-decoration: underline;
  transition: color 0.2s;
}
:deep(.ProseMirror a:hover) {
  color: #0284c7; /* sky-600 */
}

/* ========== 图片 ========== */
:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* ========== 列表 ========== */
:deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}
:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
}
:deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
  line-height: 1.6;
}

/* ========== 引用块 ========== */
:deep(.ProseMirror blockquote) {
  border-left: 4px solid #0ea5e9; /* sky-500 */
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  background-color: #f0f9ff; /* sky-50 */
  border-radius: 0 0.5rem 0.5rem 0;
  color: #334155;
  font-style: italic;
}
:deep(.ProseMirror blockquote p) {
  margin: 0;
}

/* ========== 代码块 ========== */
:deep(.ProseMirror pre) {
  background-color: #1e293b; /* slate-800 */
  color: #e2e8f0; /* slate-200 */
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}
:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

/* ========== 行内代码 ========== */
:deep(.ProseMirror code) {
  background-color: #f1f5f9; /* slate-100 */
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.9em;
  color: #1e293b;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* ========== 水平分割线 ========== */
:deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid #e2e8f0; /* slate-200 */
  margin: 1.5rem 0;
}

/* ========== 表格（已统一） ========== */
:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
}
:deep(th),
:deep(td) {
  border: 1px solid #cbd5e1; /* slate-300 */
  padding: 0.5rem 0.75rem;
  text-align: left;
}
:deep(th) {
  background-color: #f1f5f9; /* slate-100 */
  font-weight: 600;
}
:deep(td) {
  background-color: #ffffff;
}

/* ========== 高亮/背景色 ========== */
:deep(mark) {
  background-color: #fef08a; /* yellow-200 */
  padding: 0.1em 0.2em;
  border-radius: 0.2rem;
}

/* ========== 选中状态 ========== */
:deep(.ProseMirror *::selection) {
  background-color: #bae6fd; /* sky-200 */
}

/* ========== 视频容器 ========== */
:deep(.ProseMirror [data-youtube-video]) {
  display: block;
  margin: 1rem auto;
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 600px;
}
</style>