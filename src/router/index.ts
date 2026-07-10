import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import PostList from '@/pages/post/PostList.vue'
import PostEditor from '@/pages/post/PostEditor.vue'
import CategoryList from '@/pages/category/CategoryList.vue'
import CategoryEditor from '@/pages/category/CategoryEditor.vue'
import FloorList from '@/pages/floor/FloorList.vue'
import FloorEditor from '@/pages/floor/FloorEditor.vue'
import TaskList from '@/pages/task/TaskList.vue'
import TaskEditor from '@/pages/task/TaskEditor.vue'
import Login from '@/pages/Login.vue'
import Editor from "@/pages/Editor.vue"

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/home',
    component: AdminLayout,
    children: [
      { path: 'home', name: 'dashboard', component: Dashboard },
      { path: 'post', name: 'post-list', component: PostList },
      { path: 'post/new', name: 'post-create', component: PostEditor },
      { path: 'post/:post_id/edit', name: 'post-edit', component: PostEditor },
      { path: 'category', name: 'category-list', component: CategoryList },
      { path: 'category/new', name: 'category-create', component: CategoryEditor },
      { path: 'category/:category_id/edit', name: 'category-edit', component: CategoryEditor },
      { path: 'floor', name: 'floor-list', component: FloorList },
      { path: 'floor/new', name: 'floor-create', component: FloorEditor },
      { path: 'floor/:floor_id/edit', name: 'floor-edit', component: FloorEditor },
      { path: 'task', name: 'task-list', component: TaskList },
      { path: 'task/new', name: 'task-create', component: TaskEditor },
      { path: 'task/:task_id/edit', name: 'task-edit', component: TaskEditor },
      { path: 'editor', name: 'editor', component: Editor },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/') // 已登录则重定向到首页
  } else {
    next()
  }
})

export default router