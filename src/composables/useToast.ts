import { ref } from 'vue'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  text: string
  duration?: number
}

const toasts = ref<ToastMessage[]>([])
let toastId = 0

function addToast(type: ToastMessage['type'], text: string, duration = 3000) {
  const id = String(++toastId)
  const toast: ToastMessage = { id, type, text, duration }
  toasts.value.push(toast)

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

function removeToast(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export const toast = {
  success: (text: string, duration?: number) => addToast('success', text, duration),
  error: (text: string, duration?: number) => addToast('error', text, duration),
  warning: (text: string, duration?: number) => addToast('warning', text, duration),
  info: (text: string, duration?: number) => addToast('info', text, duration),
  remove: removeToast,
  toasts
}