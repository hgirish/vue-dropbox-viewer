Vue.component('breadcrumb', {
  template: `
<div>
<span v-for="(f,i) in folders">
<a
v-bind:href="f.path">{{ f.name || 'Home' }}</a>
<span v-if="i !== (folders.length -1)"> &raquo; </span>
</span>
</div>
`,
  computed: {
    folders() {
      let output = [];
      let slug = '';
      let parts = this.$store.state.path.split('/');
      for (let item of parts) {
        slug += item;
        output.push({
          'name': item || 'home',
          'path': '#' + slug
        });
        slug += '/';
      }
      return output;
    },
  },
});
