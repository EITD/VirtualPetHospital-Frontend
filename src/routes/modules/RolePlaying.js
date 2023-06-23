import RolePlaying from '@/components/role/RolePlaying.vue';
const rolePlaying = [
    {
        path: '/rolePlaying',
        name: 'RolePlaying',
        component: RolePlaying,
        meta: {
            template: 'oneScreenTemp',
            keepAlive: false,
            isAuth: true
        }
    }
];
export default rolePlaying;