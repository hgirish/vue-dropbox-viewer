window.onhashchange = () => {
  app.updateHash();
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

const app = new Vue({
  el: '#app',
  data: {
    path: '',
  },
  methods: {
    updateHash() {
      let hash = window.location.hash.substring(1);
      this.path = (hash || '');
    },
  },
  created() {
    this.updateHash();
  },
  template: `
<dropbox-viewer :path="path"></dropbox-viewer>
`
});