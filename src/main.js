import { createApp } from 'vue';
import App from './App.vue';
import i18n from '@/langs/i18n';
import store from '@/store';
import { router } from '@/routes';
// import CryptoJS from 'crypto-js/crypto-js';
import cnf from '@/configs';
import { getUrlParams } from '@/utils/get-url-params';
import { RequestManager } from '@/utils/request-manager';
import { ErrCode } from '@/utils/err-code';
import { logAct } from '@/utils/show-log';
import request from '@/utils/request';
// import { getConfigs } from '@/components/common/get-user-info'
import * as echarts from 'echarts';

import {
  ConfigProvider, Layout, Image, Menu, Tooltip, Select, Button,
  Input, Form, PageHeader, Progress, Row, Col, Table, Modal, DatePicker, InputNumber, message, Radio, Upload,
  Pagination, TimePicker, Tag, Spin, Alert, Cascader, Typography, Popconfirm, List, Badge, Steps
} from 'ant-design-vue';
const startApp = async () => {
  // let token = localStorage.getItem('token');
  // if (token) {
  //   // await getConfigs(token);
  // }
  runApp();
};
const runApp = () => {
  const app = createApp(App);
  app.config.productionTip = false;
  app.config.globalProperties.showLog = logAct;
  app.config.globalProperties._cnf = cnf;
  app.config.globalProperties._reqMan = RequestManager.getInstance();
  app.config.globalProperties._errCode = ErrCode.getInstance();
  app.config.globalProperties.$modal = Modal;
  app.config.globalProperties.$message = message;
  app.config.globalProperties.request = request
  app.config.globalProperties.$echarts = echarts
  app.use(i18n).use(router).use(store);
  app.use(ConfigProvider)
    .use(Layout)
    .use(Image)
    .use(Menu)
    .use(Tooltip)
    .use(Select)
    .use(Button)
    .use(Input)
    .use(Form)
    .use(PageHeader)
    .use(Progress)
    .use(Row)
    .use(Col)
    .use(Modal)
    .use(DatePicker)
    .use(InputNumber)
    .use(Pagination)
    .use(TimePicker)
    .use(Tag)
    .use(Table)
    .use(Radio)
    .use(Upload)
    .use(Spin)
    .use(Cascader)
    .use(Typography)
    .use(Popconfirm)
    .use(List)
    .use(Badge)
    .use(Alert)
    .use(Steps);
  app.mount('#app');
  document.title = "宠物医院前台系统";
};
startApp();