const guide = () => import('@/components/guide/index.vue');
const guideView = () => import('@/components/guide/view.vue');
const surgical =() => import('@/components/guide/surgical.vue')
const patientRoom =() => import('@/components/guide/patientRoom.vue')
const front =() => import('@/components/guide/front.vue')
const guideManage = [
   {
    path: '/CT',
    name: 'Guide',
    component: guide,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: true
    },
    children: [
    ]
   },
   {
    path: '/surgical',
    name: 'Surgical',
    component: surgical,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: true
    },
    children: [
    ]
   },
   {
    path: '/patientRoom',
    name: 'PatientRoom',
    component: patientRoom,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: true
    },
    children: [
    ]
   },
   {
    path: '/front',
    name: 'front',
    component: front,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: true
    },
    children: [
    ]
   },
   {
    path: '/guideView',
    name: 'GuideView',
    component: guideView,
    meta: {
      template: 'oneScreenTemp',
      keepAlive: false,
      isAuth: true
    },
    children: [
    ]
   }
];
export default guideManage;