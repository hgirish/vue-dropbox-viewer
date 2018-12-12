Vue.component('file', {
  props: {
    f: Object,
    d: Object,
  },
  data() {
    return {
      byteSizes: ['Bytes', 'KB', 'MB', 'GB', 'TB'],
      link: false,
    }
  },
  created() {
    this.d.filesGetTemporaryLink({
      path:
        this.f.path_lower
    }).then(data => {
      this.link = data.link;
    })
  },
  methods: {
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