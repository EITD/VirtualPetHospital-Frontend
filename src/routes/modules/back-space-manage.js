const backSpaceManage = () => import('@/components/back-space-manage/index.vue');
const spaceManage = () => import('@/components/back-space-manage/space-manage/index.vue');
const orgSpaceList = () => import('@/components/back-space-manage/org-space-list/index.vue');
const backSpaceManagement = [
   {
    path: '/backSpaceManage',
    name: 'backSpaceManage',
    component: backSpaceManage,
    meta: {
      template: 'dashboardTemp',
      keepAlive: false,
      isAuth: true
    },
    children: [
      {
        path: 'spaceManage',
        name: 'spaceManage',
        component: spaceManage,
        meta: {
          template: 'dashboardTemp',
          keepAlive: false,
          isAuth: true
        }
      },
      {
        path: 'orgSpaceList',
        name: 'orgSpaceList',
        component: orgSpaceList,
        meta: {
          template: 'dashboardTemp',
          keepAlive: false,
          isAuth: true
        }
      },
    ]
   }
];
export default backSpaceManagement;