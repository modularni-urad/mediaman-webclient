import {uploadFile} from './utils.js'

export default {
  data: () => {
    return {
      opened: false
    }
  },
  props: ['query', 'cfg', 'row', 'doEdit'],
  methods: {
    getLink: function () {
      const link = this.$store.state.cfg.cdn + this.row.filename
      this.$copyText(link).then(() => {
        this.$store.dispatch('toast', { message: `odkaz zkopírován do schránky` })
      }).catch(() => alert(link))
    },
    doOverwrite: function () {
      this.opened = true
    },
    uploadFiles: async function (event) {
      const f = event.target.files[0]
      const filename = this.row.filename
      const upload = {filename, size: 0, progress: 0, status: '' }
      try {
        await uploadFile(f, upload, filename, this.cfg, this, true)
        await this.$store.dispatch('send', { 
          method: 'put', 
          url: `${this.cfg.url}/${filename}`,
          data: { filename }
        })
        this.$store.dispatch('toast', { message: `soubor nahrán`, type: 'success' })
        this.opened = false
        this.$parent.fetchData()
      } catch (err) {
        this.$store.dispatch('onerror', { err })
      }
    }
  },
  computed: {
    isImage: function () {
      return this.row.ctype.indexOf('image') >= 0
    },
    muzuUpravit: function () {
      // return this.$store.getters.isMember(this.row.group)
      return true
    }
  },
  template: `
  <td>
    <img v-if="isImage" style="display: inline-block; width: 150px;" 
      :src="$store.getters.mediaUrl(row.filename, 'w=150')" 
    />
    
    <b-button v-if="muzuUpravit" size="sm" variant="primary" @click="doEdit(row)">
      <i class="fas fa-edit"></i> upravit
    </b-button>
    <b-button v-if="muzuUpravit" size="sm" variant="warning" @click="doOverwrite">
      <i class="fas fa-edit"></i> přepsat
    </b-button>
    <b-button size="sm" variant="secondary" @click="getLink">
      <i class="fas fa-link"></i> odkaz
    </b-button>

    <b-modal v-model="opened" size="xl" title="nahrát soubor" hide-footer>
      <input type="file" @change="uploadFiles" />
    </b-modal>
  </td>
  `
}