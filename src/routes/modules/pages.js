import Login from '@/components/login/index.vue';
import Home from '@/components/home/index.vue';
const pages = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: true
    }
  }
];
export default pages;