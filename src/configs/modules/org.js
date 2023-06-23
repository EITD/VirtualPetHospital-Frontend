const org = {
  // 获取内部组织列表
  getInnerList: { method: '/api/organization/inner', type: 'get', response: 'json' },
  //移除组织
  removeOrg: { method: '/api/organization', type: 'delete', response: 'josn' },
  //内部组织修改
  innerOrgUpdate: { method: '/api/organization/resource', type: 'post', response: 'json' },
  //批量调整权益路数
  changeManyOrgCaps: { method: '/api/organization/orgCaps', type: 'post', response: 'json' },
  //调整内部组织默认路数
  changeDefaultOrgCaps: { method: '/api/organization/innerOrg/renderLimit', type: 'patch', response: 'json' },
  //获取内部组织权益路数
  getDefaultOrgCaps: { method: '/api/organization/innerOrg/renderLimit', type: 'get', response: 'json' },
  //获取内部资源池
  getinnerPool: { method: '/api/resourcePool/inner', type: 'get', response: 'json' },
  //内部组织更改资源池
  innerOrgPoolUpdate: { method: '/api/organization/resource', type: 'post', reponse: 'json' },
  //所有组织(内外部)详情列表(查询)
  getAllOrg: { method: '/api/organization/all', type: 'get', reponse: 'json' },
  //天气
  getWeather: { }
}
export default org