export default {
  props: ['query', 'cfg', 'row', 'doEdit'],
  methods: {
    getLink: function () {
      const link = this.$store.state.cfg.cdn + this.row.filename
      this.$copyText(link).then(() => {
        this.$store.dispatch('toast', { message: `odkaz zkopírován do schránky` })
      }).catch(() => alert(link))
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
    <img v-if="isImage" style="display: inline-block;" 
      :src="$store.getters.mediaUrl(row.filename, 'w=150')" 
    />
    
    <b-button v-if="muzuUpravit" size="sm" variant="primary" @click="doEdit(row)">
      <i class="fas fa-edit"></i> upravit
    </b-button>
    <b-button size="sm" variant="secondary" @click="getLink">
      <i class="fas fa-link"></i> odkaz
    </b-button>
  </td>
  `
}