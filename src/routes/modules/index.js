import Index from '@/components/index/index.vue';
const indexes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      template: 'dashboardTemp',
      keepAlive: false,
      isAuth: true
    },
    redirect: '/login'
  }
];
export default indexes;