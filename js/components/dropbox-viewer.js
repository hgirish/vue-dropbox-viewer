/**
 * The dropbox component
 * @example <dropbox-viewer></dropbox-viewer>
 */
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
    // Display the current path & cache parent folders
    this.displayFolderStructure();
    this.cacheParentFolders();
  },
  watch: {
    path() {
      this.displayFolderStructure();
    },

  },
  methods: {
    /**
     * Dropbox API instance
     * @return {object}
     */
    dropbox() {
      return new Dropbox.Dropbox({
        accessToken: this.accessToken
      })
    },
    /**
     * Loop through the breadcrumb and cache parent folders
     */
    cacheParentFolders() {
      let parents = this.$store.state.breadcrumb;
      parents.reverse().shift();

      for (let parent of parents) {
        this.getFolderStructure(parent.path);
      }
    },
    /**
     * Display the contents of getFolderStructure
     * Updates the output to display the folders and files
     */
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
    /**
     * Retrieve the folder structure from the cache or Dropbox API
     * @param {string} path  The folder path
     * @returns {Promise} A promise containing the folder data
     */
    getFolderStructure(path) {
      let output;

      const slug = this.generateSlug(path);
      const data = this.$store.state.structure[slug];

      if (data) {
        output = Promise.resolve(data);
      } else {
        output = this.dropbox().filesListFolder({
          path: path,
          include_media_info: true
        })
          .then(response => {
            let entries = response.entries;
            this.$store.commit('structure', {
              path: slug,
              data: entries
            });
            return entries;
          })
          .catch(error => {
            this.isLoading = 'error';
            console.error(error);
          })
      }

      return output;
    },
    /**
     * Generate clean URL
     * @param {string} path
     * @return {string} A cache-friendly URL without punctuation/symbols
     */
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
    // The current folder path
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
  <template v-for="entry in structure.folders">
<folder :f="entry" :cache="getFolderStructure"></folder>
  </template>
  <template v-for="entry in structure.files">
<file v-bind:d="dropbox()" v-bind:f="entry"></file>
  </template>
  </ul>
  </div>
  </transition>
  </div>
  `
})
