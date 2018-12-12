window.onhashchange = () => {
  app.$store.commit('updateHash');
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
  store,
  data: {
    path: '',
  },
  computed: {

  },
  methods: {},
  created() {
    store.commit('updateHash');
  },
  template: `
  <div>
<dropbox-viewer></dropbox-viewer>

</div>
`
});
