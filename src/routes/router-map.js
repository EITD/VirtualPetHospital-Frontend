import NotFound from '@/components/common-comps/not-found.vue'
let configRouters = []
const files = import.meta.globEager('./modules/*.js')
Object.values(files).forEach(v => {
  configRouters = configRouters.concat(v.default)
})
export const routerMap = [
  ...configRouters,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: true
    }
  }
]