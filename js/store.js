const store = new Vuex.Store({
  state: {
    path: '',
    structure: {},
    breadcrumb: [],
  },
  getters: {},
  mutations: {
    updateHash(state) {
      let path = (window.location.hash.substring(1) || '');

      let breadcrumb = [];

      let slug = '';
      let parts = path.split('/');

      for (let item of parts) {
        slug += item;
        breadcrumb.push({ 'name': item || 'home', 'path': slug });
        slug += '/';
      }
      state.path = path;
      state.breadcrumb = breadcrumb;

    },
    structure(state, payload) {
      state.structure[payload.path] = payload.data;
    },
  }
});
