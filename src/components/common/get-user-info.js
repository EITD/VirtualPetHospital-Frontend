import { RequestManager } from '@/utils/request-manager';
import store from '@/store';
import cnf from '@/configs';
import CryptoJS from 'crypto-js/crypto-js';
import { logAct } from '@/utils/show-log';
export const getUserinfoByToken = async (token = null) => {
  let headers = { token: `Bearer ${token}` };
  let res = await RequestManager.getInstance().requestFunc('getUserinfoByToken', headers, {}, '');
  if (res.success) {
    let sk = JSON.parse(CryptoJS.AES.decrypt(res.result, cnf.sk).toString(CryptoJS.enc.Utf8));
    logAct('User SK Info', sk);
    let userinfo = sk;
    store.commit('user/_setState', { userinfo });
    store.commit('system/_setState', { permissionList: sk.permissionList, menuData: generateMenu(sk.permissionList) });
  }
}
export const getConfigs = async (token = null) => {
  let headers = { token: `Bearer ${token}` };
  let res = await RequestManager.getInstance().requestFunc('getConfigs', headers, {}, '');
  if (res.success) {
    logAct('Configs Info', res.result);
    store.commit("system/_setState", { configInfo: res.result });
  }
}