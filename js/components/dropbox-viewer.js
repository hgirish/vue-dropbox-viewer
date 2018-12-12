Vue.component('dropbox-viewer', {
  data() {
    return {
      accessToken: '',
      structure: {},
      isLoading: true,
    }
  },
  props: {
    path: String,
  },
  created() {
    this.accessToken = appConfig.accessToken;
    this.getFolderStructure(this.path);
  },
  methods: {
    dropbox() {
      return new Dropbox.Dropbox({
        accessToken: this.accessToken
      })
    },
    getFolderStructure(path) {
      this.dropbox().filesListFolder({
        path: path,
        include_media_info: true
      })
        .then(response => {
          // console.log(response.entries);
          // sleep(1000);
          const structure = {
            folders: [],
            files: []
          };
          for (let entry of response.entries) {
            if (entry['.tag'] === 'folder') {
              structure.folders.push(entry);
            } else {
              structure.files.push(entry);
            }
          }
          this.structure = structure;
          this.isLoading = false;
        })
        .catch(error => {
          console.error(error);
          this.isLoading = 'error';
        })
    },
    updateStructure(path) {
      this.isLoading = true;
      this.getFolderStructure(path);
    },

  },
  watch: {
    path() {
      this.updateStructure(this.path);
    }
  },
  template: `
  <div>
  <h1>Dropbox</h1>
  <transition name="fade">
  <div  v-if="isLoading">
  <div class="alert alert-warning" v-if="isLoading === 'error'">
  <p>There seems to be an issue with the URL entered.</p>
  <p><a href="">Go Home</a></p>
  </div>
  <div class="loader" v-else>
  Loading...
  </div>
  </div>
  </transition>
  <transition name="fade">
  <div v-if="!isLoading">
  <breadcrumb v-bind:p="path"></breadcrumb>
  <template v-for="f in structure.folders">
<folder v-bind:f="f"></folder>
  </template>
  <template v-for="f in structure.files">
<file v-bind:d="dropbox()" v-bind:f="f"></file>
  </template>
  </ul>
  </div>
  </transition>
  </div>
  `
})