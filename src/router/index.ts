import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../scenes/SignIn.vue'
import SignUp from '../scenes/SignUp.vue'
import PrivateProvider from '../providers/PrivateProvider.vue'
import Tasks from '../scenes/TasksPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SignIn
    },
    {
      path: '/sign-up',
      component: SignUp
    },
    {
      path: '/private',
      component: PrivateProvider,
      children: [{ path: 'tasks', component: Tasks }]
    }
  ]
})

export default router
