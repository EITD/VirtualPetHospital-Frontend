const spaceManage ={
    //空间查询
    getSpaceList: { method: '/api/space', type: 'get', response: 'json' },
    //空间上架下架操作
    changeStatus: { method: '/api/space/status', type: 'patch', response: 'json' },
    //删除空间
    deleteSpace: { method: '/api/space', type: 'delete', response: 'json' },
    //专属空间添加组织
    addOrg: { method: '/api/space/related/org', type: 'post', response: 'json' },
    //新建空间
    createSpace: { method: '/api/space/new', type: 'post', response: 'json' }
};
export default spaceManage