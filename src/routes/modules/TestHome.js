import TestHome from '@/components/TestHome.vue';
const testHome = [
    {
        path: '/testHome',
        name: 'TestHome',
        component: TestHome,
        meta: {
            template: 'oneScreenTemp',
            keepAlive: false,
            isAuth: false
        }
    }
];
export default testHome;