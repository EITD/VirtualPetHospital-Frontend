const resourcePool = {
  // 获取资源池列表
  getResourcePoolList: { method: '/api/resourcePool/search', type: 'get', response: 'json' },
  // 创建新的资源池
  creatNewResourcePool: { method: '/api/resourcePool/new', type: 'post', response: 'json' },
  //编辑资源池
  editResourcePool: { method: '/api/resourcePool', type: 'patch', repsonse: 'json' },
  //查询资源池名称是否重复
  checkOrgNameExistence: { method: '/api/resourcePool/judge/repeat', type: 'get', repsonse: 'json' },
  //更改资源池
  updateResourcePool: { method: '/api/resourcePool', type: 'patch', response: "json" },
  //查看管理员可以创建的资源池类型
  checkPoolType: { method: '/api/resourcePool/type', type: 'get', response: 'json' }
}
export default resourcePool