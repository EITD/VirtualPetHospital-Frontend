import RoleLearning from '@/components/role/RoleLearning.vue';
const roleLearning = [
    {
        path: '/roleLearning',
        name: 'RoleLearning',
        component: RoleLearning,
        meta: {
            template: 'oneScreenTemp',
            keepAlive: false,
            isAuth: true
        }
    }
];
export default roleLearning;