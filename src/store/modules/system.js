import { mixinFunc } from '../mixin-func';
const system = {
  name: 'system',
  namespaced: true,
  state () {
    return {
      permissionList: [], // 权限列表
      menuData: [], // 菜单显示列表
      loadingMask: false, // 全局loading层状态
      loadingMaskTxt: null, // 全局loading层文案（可以是html对象）
      configInfo: {
        uploadUrl: '',
        uploadPath: ''
      }, // 配置信息
      fixInfo:{

      }//维修消息
    }
  },
  getters: {
    ...mixinFunc.getters
  },
  mutations: {
    ...mixinFunc.mutations
  }
};
export default system;