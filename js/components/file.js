/**
* File component display size of file and download link
* @example <file :d="dropbox()" :f="entry"></file>
*
* @param {object} f The file entry from the tree
* @param {object} d The dropbox instance from the parent component
*/
Vue.component('file', {
  props: {
    f: Object,
    d: Object,
  },
  data() {
    return {
      // List of file size
      byteSizes: ['Bytes', 'KB', 'MB', 'GB', 'TB'],
      // The download link
      link: false,
    }
  },
  created() {
    // If the download link has be retrieved from the API, use it
    // if not, query the API
    if (this.f.download_link) {
      this.link = this.f.download_link;
    } else {
      this.d.filesGetTemporaryLink({
        path:
          this.f.path_lower
      }).then(data => {
        this.f.download_link = this.link = data.link;
      })
    }
  },
  methods: {
    /**
     * Convert an integer to a human readable file size
     * @param {integer} bytes
     * @return {string}
     */
    bytesToSize(bytes) {
      let output = '0 Byte';
      if (bytes > 0) {
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

        output = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + this.byteSizes[i];
      }
      return output;
    },
  },
  template: `
  <li>
  <strong>{{f.name}}</strong>
  <span v-if="f.size"> - {{bytesToSize(f.size)}}</span>
  <span v-if="f.media_info">
  [
    {{f.media_info.metadata.dimensions.width}} px x
    {{f.media_info.metadata.dimensions.height}} px
  ]
  </span>
  <span v-if="link"> - <a v-bind:href="link">Download</a></span>

  </li>
  `
})