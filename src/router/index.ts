import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import PostList from '@/pages/post/PostList.vue'
import PostEditor from '@/pages/post/PostEditor.vue'
import CategoryList from '@/pages/category/CategoryList.vue'
import Editor from "@/pages/Editor.vue";

const routes = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '', name: 'dashboard', component: Dashboard },
      { path: 'post', name: 'post-list', component: PostList },
      { path: 'post/new', name: 'post-create', component: PostEditor },
      { path: 'post/:post_id/edit', name: 'post-edit', component: PostEditor },
      { path: 'category', name: 'category-list', component: CategoryList },
      { path: 'editor', name: 'editor', component: Editor },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router