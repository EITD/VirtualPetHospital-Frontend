import CaseDetail from '@/components/case/CaseDetail.vue';
const caseDetail = [
    {
        path: '/caseDetail',
        name: 'CaseDetail',
        component: CaseDetail,
        meta: {
            template: 'oneScreenTemp',
            keepAlive: false,
            isAuth: true
        }
    }
];
export default caseDetail;