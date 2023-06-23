import { createRouter, createWebHistory } from 'vue-router';
import { routerMap } from './router-map';
// import store from "@/store";
export const router = createRouter({
  history: createWebHistory(),
  routes: routerMap,
});
router.onError((err) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = err.message.match(pattern);
  if (isChunkLoadFailed) window.location.reload();
});
router.resolve({
  name: 'NotFound',
  params: { pathMatch: ['not', 'found'] },
}).href;
router.beforeEach((to, from, next) => {
  // let permissionList = store.getters["system/_getState"]("permissionList");
  let token = localStorage.getItem('token')
  if (to.meta.isAuth && !token) {
    window.location.href = "/";
  } else {
    next();
  }
});