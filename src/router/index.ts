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
import UserInfo from "@/pages/setting/UserInfo.vue";
import ConfigEditor from "@/pages/configuration/ConfigEditor.vue";

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
      {
        path: 'home',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: '仪表盘' }
      },
      {
        path: 'config',
        name: 'config',
        component: ConfigEditor,
        meta: { title: '网站配置' }
      },
      {
        path: 'post',
        name: 'post-list',
        component: PostList,
        meta: { title: '文章管理' }
      },
      {
        path: 'post/new',
        name: 'post-create',
        component: PostEditor,
        meta: { title: '新增文章' }
      },
      {
        path: 'post/:post_id/edit',
        name: 'post-edit',
        component: PostEditor,
        meta: { title: '编辑文章' }
      },
      {
        path: 'category',
        name: 'category-list',
        component: CategoryList,
        meta: { title: '分类管理' }
      },
      {
        path: 'category/new',
        name: 'category-create',
        component: CategoryEditor,
        meta: { title: '新增分类' }
      },
      {
        path: 'category/:category_id/edit',
        name: 'category-edit',
        component: CategoryEditor,
        meta: { title: '编辑分类' }
      },
      {
        path: 'floor',
        name: 'floor-list',
        component: FloorList,
        meta: { title: '楼层管理' }
      },
      {
        path: 'floor/new',
        name: 'floor-create',
        component: FloorEditor,
        meta: { title: '新增楼层' }
      },
      {
        path: 'floor/:floor_id/edit',
        name: 'floor-edit',
        component: FloorEditor,
        meta: { title: '编辑楼层' }
      },
      {
        path: 'task',
        name: 'task-list',
        component: TaskList,
        meta: { title: '任务管理' }
      },
      {
        path: 'task/new',
        name: 'task-create',
        component: TaskEditor,
        meta: { title: '新增任务' }
      },
      {
        path: 'task/:task_id/edit',
        name: 'task-edit',
        component: TaskEditor,
        meta: { title: '编辑任务' }
      },
      {
        path: 'setting',
        name: 'setting',
        component: UserInfo,
        meta: { title: '系统设置' }
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/') // 已登录则重定向到首页
  } else {
    next()
  }
})

router.afterEach((to) => {
  const baseTitle = 'Ice Candle Admin'
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle
})

export default router