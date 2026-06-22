import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExplorerView from '../views/ExplorerView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/explorer',
      name: 'explorer',
      component: ExplorerView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
    },
  ],
})

export default router
