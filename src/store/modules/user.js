import { mixinFunc } from '../mixin-func'
const user = {
  name: 'user',
  namespaced: true,
  state () {
    return {
      userinfo: null
    }
  },
  getters: {
    ...mixinFunc.getters
  },
  mutations: {
    ...mixinFunc.mutations
  }
}
export default user