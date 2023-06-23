import CaseStudy from '@/components/case/CaseStudy.vue';
const caseStudy = [
    {
        path: '/caseStudy',
        name: 'CaseStudy',
        component: CaseStudy,
        meta: {
            template: 'oneScreenTemp',
            keepAlive: false,
            isAuth: true
        }
    }
];
export default caseStudy;