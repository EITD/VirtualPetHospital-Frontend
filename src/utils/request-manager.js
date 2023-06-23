import axios from 'axios';
import uuid from 'node-uuid';
import cnf from '@/configs';
let requestInstance = null;
export class RequestManager {
  constructor () {
    // 构造函数
  }
  static getInstance () {
    if (requestInstance == null) requestInstance = new RequestManager();
    return requestInstance;
  }
  setOptions (options, requestType = 'request') {
    let api = cnf.api;
    let type = api[options[0]].type;
    let method = cnf.apiRootPath + api[options[0]].method + options[3];
    console.log('method',method)
    let response = api[options[0]].response;
    let headers = options[1];
    headers['x-request-id'] = uuid.v1();
    let datas = options[2];
    let requestOptions = {
      method: type,
      url: method,
      responseType: response,
      headers: headers
    };
    if (type === 'get') {
      requestOptions.params = datas;
      // requestOptions.params.timeStamp = new Date().getTime();
    } else {
      requestOptions.data = datas;
      // requestOptions.data.timeStamp = new Date().getTime();
    }
    if (requestType === 'upload') {
      requestOptions.onUploadProgress = (progressEvent) => {
        if (options[5]) {
          progressEvent.callbackParams = options[4];
        }
        options[4](progressEvent);
      }
    }
    return requestOptions;
  }
  requestFunc (...options) {
    return axios(this.setOptions(options)).then(response => {
      if (response.data.success) {
        return response.data;
      } else {
        return { success: false, errCode: response?.data?.errCode ?? 11000, errMsg: response?.data?.msg ?? 'error', result: response?.data ?? null };
      }
    }).catch(error => {
      console.log(error);
      // if (error.response.status == 401) {
      //   // 重新登录
      //   localStorage.removeItem('token');
      //   window.location.href = "/login";
      // }
      // if (error.response.status == 403) {
      //   localStorage.removeItem('token');
      //   window.location.href = "/login";
      // }
      return { success: false, errCode: error?.response?.data?.errCode ?? 11000, status: error?.response?.status ?? 500, result: error?.response?.data ?? null };
    })
  }
  interceptorsReq (func) {
    return axios.interceptors.request.use(function (config) {
      // You can do somethings before sending Request.
      func();
      return config;
    }, function (error) {
      // You can do somethings when error occurs.
      return Promise.reject(error);
    });
  }
  interceptorsRes (func) {
    return axios.interceptors.response.use(function (response) {
      // You can do somethings after get Response
      func();
      return response;
    }, function (error) {
      // You can do somethings when error occurs.
      return Promise.reject(error);
    });
  }
  clearIntercaptors (cap, t) {
    t === 'request' ? axios.interceptors.request.reject(cap) : axios.interceptors.response.reject(cap)
  }
}