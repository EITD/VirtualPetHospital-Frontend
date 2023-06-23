export const mixinFunc = {
  getters: {
    _getState: (state) => (k) => {
      return state[k];
    }
  },
  mutations: {
    _setState (state, opt) {
      for (let k in opt) {
        state[k] = opt[k];
      }
    }
  }
};