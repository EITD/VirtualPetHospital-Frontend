const repairManage = {
    getRepairInfo: { method: '/api/community/repair/page', type: 'post', response: 'json' },
    addRepairInfo: { method: '/api/community/repair/create', type: 'post', response: 'json' },
    updateRepairInfo: { method: '/api/community/repair/update', type: 'post', response: 'json' },
    deleteRepairInfo: { method: '/api/community/repair/delete', type: 'post', response: 'json' },
    distribute: { method:'/api/community/repair/distribute', type: 'post', response: 'json' },
    // deleteHouseInfo: { method: '/api/community/house/batchDelete', type: 'post', response: 'json' },
  }
  export default repairManage