import ExamCard from '@/components/exam/ExamCard.vue';
const examCard = [
    {
        path: '/examCard/:id',
        name: 'ExamCard',
        component: ExamCard,
        meta: {
            template: 'oneScreenTemp',
            keepAlive: false,
            isAuth: false
        }
    }
];
export default examCard;