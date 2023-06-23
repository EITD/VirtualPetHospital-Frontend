import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import jaJP from 'ant-design-vue/es/locale/ja_JP';
let configApi = {};
const files = import.meta.globEager('./modules/*.js');
Object.values(files).forEach(v => {
  Object.assign(configApi, v.default);
});
const config = {
  sk: 'qMd0LRpYiNYyMAY9Z4u7c1xE68GYJkr7',
  apiRootPath: '/api',
  languages: {
    cn: zhCN,
    en: enUS,
    jp: jaJP
  },
  api: {
    ...configApi
  }
};
export default config;