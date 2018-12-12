const store = new Vuex.Store({
  state: {
    path: '',
    structure: {},
  },
  getters: {},
  mutations: {
    updateHash(state) {
      let hash = window.location.hash.substring(1);
      state.path = (hash || '');
    },
    structure(state, payload) {
      state.structure[payload.path] = payload.data;
      console.log('state.structure', state.structure);
    },
  }
});
