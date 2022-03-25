import UploadForm from './upload_form.js'

export default {
  data: () => {
    return {
      found: [],
      opened: false
    }
  },
  props: ['cfg', 'query'],
  methods: {
    add: function () {
      this.opened = true
    },
    onClose: function () {
      this.opened = false
    }
  },
  components: { UploadForm },
  template: `
  <b-button variant="primary" @click="add">
    <i class="fas fa-plus"></i> nahrát
    <b-modal @hidden="onClose" v-model="opened" size="xl" 
      title="nahrát soubory" hide-footer>
      <UploadForm :cfg="cfg" :query="query" />
    </b-modal>
  </b-button>
  `
}