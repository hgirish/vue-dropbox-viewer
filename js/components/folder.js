/**
 * Displays a folder with a link and cache its contents
 * @example <folder :f="entry" :cache="getFolderStructure"></folder>
 *
 * @param {object} f The folder entry from the tree
 * @param {function} cache The getFolderStructure method from
 *  the dropbox-viewer component
 */
Vue.component('folder', {
  template: `<li>
  <strong><a :href="'#' + f.path_lower">{{f.name}}</a></strong>
  </li>`,
  props: {
    f: Object,
    cache: Function
  },
  methods: {
  },
  created() {
    // Cache the contents ot the folder
    this.cache(this.f.path_lower);
  }
});
