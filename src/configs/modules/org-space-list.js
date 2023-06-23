const orgSpaceList = {
    //组织专属空间详细列表
    getOrgSpaceList: { method: '/api/space/orgSpace', type: 'get', response: 'json' },
    //上架下架单个组织的专属空间
    changeOrgSpaceStatus: { method: '/api/space/org/spaceStatus', type: 'post', response: 'json' }

}
export default orgSpaceList;