import { createI18n } from 'vue-i18n';
import { getNavigatorLang } from '@/utils/get-navigator-lang';
import messages from './index';
const i18n = createI18n({
  locale: localStorage.getItem('lang') || getNavigatorLang(),
  // locale: 'cn',
  messages
});
export default i18n;