const infoManage = {
    getCarInfo: { method: '/api/community/carInfo/page', type: 'post', response: 'json' },
    addCarInfo: { method: '/api/community/carInfo/create', type: 'post', response: 'json' },
    updateCarInfo: { method: '/api/community/carInfo/update', type: 'post', response: 'json' },
    deleteCarInfo: { method: '/api/community/carInfo/batchDelete', type: 'post', response: 'json' },
    getHouseInfo: { method: '/api/community/house/page', type: 'post', response: 'json' },
    addHouseInfo: { method: '/api/community/house/create', type: 'post', response: 'json' },
    updateHouseInfo: { method: '/api/community/house/update', type: 'post', response: 'json' },
    deleteHouseInfo: { method: '/api/community/house/batchDelete', type: 'post', response: 'json' },
    getUserInfo: { method: '/api/community/owner/page', type: 'post', response: 'json' },
    addUserInfo: { method: '/api/community/owner/create', type: 'post', response: 'json' },
    updateUserInfo: { method: '/api/community/owner/update', type: 'post', response: 'json' },
    deleteUserInfo: { method: '/api/community/owner/batchDelete', type: 'post', response: 'json' },
  }
  export default infoManage