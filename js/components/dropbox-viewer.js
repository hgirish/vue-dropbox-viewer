Vue.component('dropbox-viewer', {
  data() {
    return {
      accessToken: '',
      structure: {},
      isLoading: true,
    }
  },
  created() {
    this.accessToken = appConfig.accessToken;
    this.getFolderStructure();
  },
  methods: {
    dropbox() {
      return new Dropbox.Dropbox({
        accessToken: this.accessToken
      })
    },
    createFolderStructure(response) {
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


    },
    createStructureAndSave(response) {
      this.createFolderStructure(response);
      this.$store.commit('structure', {
        path: this.slug,
        data: response
      });
    },
    getFolderStructure() {
      let data = this.$store.state.structure[this.slug];
      if (data) {
        this.createFolderStructure(data);
      } else {
        this.dropbox().filesListFolder({
            path: this.path,
            include_media_info: true
          })
          .then(this.createStructureAndSave)
          .catch(error => {
            console.error(error);
            this.isLoading = 'error';
          })
      }
    },
    updateStructure() {
      this.isLoading = true;
      this.getFolderStructure();
    },

  },
  computed: {
    path() {
      return this.$store.state.path;
    },
    slug() {
      return this.path.toLowerCase()
        .replace(/^\/|\/$/g, '')
        .replace(/ /g, '-')
        .replace(/\//g, '-')
        .replace(/[-]+/g, '-')
        .replace(/[^\w-]+/g, '');
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
  <breadcrumb></breadcrumb>
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
