import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getCurrentUser } from 'vuefire';
import { isBanned, isAdmin } from '@/firebase';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      requiresAuth: false
    },
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      requiresAuth: false
    },
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/banned',
    name: 'banned',
    meta: {
      requiresAuth: false
    },
    component: () => import('../views/BannedView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
    component: () => import('../views/AdminView.vue')
  }
  

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach(async (to) => {
  const currentUser = await getCurrentUser();
  const loggedIn = currentUser != null;
  const banned = await isBanned(currentUser?.uid || "")
  const admin = await isAdmin(currentUser?.uid || "")
  if(banned && to.name != 'banned' && loggedIn){
    return {
      path: '/banned',
      query: {
        redirect: to.fullPath
      }
    }
  }
  if(to.name == 'banned' && !banned && loggedIn){
    return {
      path: '/',
      query: {
        redirect: to.fullPath
      }
    }
  }
  if(to.meta.requiresAuth){
    
    if(!currentUser){
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      }
    }
  }
  if(to.meta.requiresAdmin){
    console.log(admin)
    if(!admin){
      return {
        path: '/',
        query: {
          redirect: to.fullPath
        }
      }
    }
  }
});


export default router
