import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi } from '@/services/auth'
import type { LoginParams } from '@/services/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const user = ref<any>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(params: LoginParams) {
    const result = await loginApi(params)
    token.value = result.token
    user.value = result.user
    localStorage.setItem('admin_token', result.token)
    // 如果需要也可以存 user
    localStorage.setItem('admin_user', JSON.stringify(result.user))
    router.push('/')
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/login')
  }

  // 初始化时从 localStorage 恢复用户信息
  const savedUser = localStorage.getItem('admin_user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch {
      // ignore
    }
  }

  return { token, user, isLoggedIn, login, logout }
})