import { getCurrentInstance } from 'vue'
export const useReq = () => {
  const { proxy } = getCurrentInstance()
  const handleReqAct = (opt = {}) => {
    let token = localStorage.getItem('token')
    let headers
    if (token)
      headers = { token: `${token}` };
    else
      headers = {};

    if (opt.contentType) headers['Content-Type'] = opt.contentType
    if (!opt.noAuth) headers['token'] = `${localStorage.getItem('token')}`
    let link = opt.link || ''
    let datas = opt.datas || {}
    for (var i in datas) {
      if (datas[i] === '') {
        delete datas[i]
      }
    }
    return proxy._reqMan.requestFunc(opt.name, headers, datas, link)
  }
  return {
    handleReqAct
  }
}