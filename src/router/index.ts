import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import PostList from '@/pages/post/PostList.vue'
import PostEditor from '@/pages/post/PostEditor.vue'
import CategoryList from '@/pages/category/CategoryList.vue'
import CategoryEditor from '@/pages/category/CategoryEditor.vue'
import FloorList from '@/pages/floor/FloorList.vue'
import FloorEditor from '@/pages/floor/FloorEditor.vue'
import Editor from "@/pages/Editor.vue";

const routes = [
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
      { path: 'editor', name: 'editor', component: Editor },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router