import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/authService';
import Login from '../views/Login.vue';
import ItemsList from '../views/ItemsList.vue';
import ProductsList from '../views/ProductsList.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/items',
    name: 'Items',
    component: ItemsList,
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router;

