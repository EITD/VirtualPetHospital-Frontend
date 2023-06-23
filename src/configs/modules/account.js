const account = {
  // 通过Token获取用户数据
  // getUserinfoByToken: { method: '/api/v1.1/user/info', type: 'get', response: 'json' },
  // 登录获取token
  logoin: { method: '/api/community/user/account/login', type: 'post', response: 'json' },
  //退出登录接口
  loginOut: { method: '/api/login/logout', type: 'post', response: 'json' }
}
export default account