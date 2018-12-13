/**
 * Displays the folder tree breadcrumb
 * @example <breadcrumb></breadcrumb>
 */
Vue.component('breadcrumb', {
  template: `
<div>
<span v-for="(f,i) in folders">
<a :href="'#' + f.path">{{ f.name || 'Home' }}</a>
<span v-if="i !== (folders.length -1)"> &raquo; </span>
</span>
</div>
`,

  computed: {
    folders() {
      let breadcrumb = this.$store.state.breadcrumb;
      return this.$store.state.breadcrumb;
    },
  },

});
