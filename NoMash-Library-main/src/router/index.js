import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import { isAuthenticated } from '../auth'
import { firebaseAuthReady, firebaseUser, firebaseRole } from '../firebaseAuth'
import { canAccessRole } from '../roles'
import AccountView from '../views/AccountView.vue'
import LibrarianView from '../views/LibrarianView.vue'
import FirebaseLogoutView from '../views/FirebaseLogoutView.vue'
import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'
import GetAllBookAPI from '../views/GetAllBookAPI.vue'

const routes = [
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: WeatherView
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI,
    meta: { jsonApi: true }
  },
  {
    path: '/GetAllBookAPI',
    name: 'GetAllBookAPI',
    component: GetAllBookAPI,
    meta: { jsonApi: true }
  },
  {
    path: '/getbookcount',
    name: 'GetBookCount',
    component: GetBookCountView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: { roles: ['member', 'librarian'] }
  },
  {
    path: '/librarian',
    name: 'Librarian',
    component: LibrarianView,
    meta: { roles: ['librarian'] }
  },
  {
    path: '/FireLogout',
    name: 'FireLogout',
    component: FirebaseLogoutView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  await firebaseAuthReady

  if (to.meta.roles) {
    if (!firebaseUser.value) return { name: 'FireLogin' }
    if (!canAccessRole(firebaseRole.value, to.meta.roles)) {
      return { name: 'AccessDenied', query: { reason: 'role-required' } }
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
        reason: 'auth-required'
      }
    }
  }

  if (to.meta.requiresGuest && isAuthenticated.value) {
    return { name: 'About' }
  }
})

export default router
