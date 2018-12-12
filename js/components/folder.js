Vue.component('folder', {
  template: `<li>
  <strong><a v-bind:href="'#' + f.path_lower">{{f.name}}</a></strong>
  </li>`,
  props: {
    f: Object
  },
  methods: {
  }
});
