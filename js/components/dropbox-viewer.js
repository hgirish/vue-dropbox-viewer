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
    this.displayFolderStructure();
  },
  watch: {
    path() {
      this.displayFolderStructure();
    },
    structure: {
      deep: true,
      handler() {
        for (let folder of this.structure.folders) {
          this.getFolderStructure(folder.path_lower);
        }
      }
    }
  },
  methods: {
    dropbox() {
      return new Dropbox.Dropbox({
        accessToken: this.accessToken
      })
    },
    displayFolderStructure() {
      this.isLoading = true;

      const structure = {
        folders: [],
        files: []
      };
      this.getFolderStructure(this.path).then(data => {
        for (let entry of data) {
          if (entry['.tag'] === 'folder') {
            structure.folders.push(entry);
          } else {
            structure.files.push(entry);
          }
        }
        this.structure = structure;
        this.isLoading = false;
      })
    },
    getFolderStructure(path) {
      let output;

      const slug = this.generateSlug(path);
      const data = this.$store.state.structure[slug];

      if (data) {
        output = Promise.resolve(data);
      } else {
        console.log(`API query for ${path}`);
        output = this.dropbox().filesListFolder({
          path: path,
          include_media_info: true
        })
          .then(response => {
            console.log(`Response for ${path}`);
            let entries = response.entries;
            this.$store.commit('structure', {
              path: slug,
              data: entries
            });
            return entries;
          })
          .catch(error => {
            this.isLoading = 'error';
            console.log(error);
          })
      }

      return output;
    },
    generateSlug(path) {
      return path.toLowerCase()
        .replace(/^\/|\/$/g, '')
        .replace(/ /g, '-')
        .replace(/\//g, '-')
        .replace(/[-]+/g, '-')
        .replace(/[^\w-]+/g, '');
    },
  },
  computed: {
    path() {
      return this.$store.state.path;
    },

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
