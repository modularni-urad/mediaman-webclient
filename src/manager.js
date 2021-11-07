const FileActions = {
  props: ['query', 'cfg', 'row'],
  methods: {
    doEdit: function () {
      const query = Object.assign({}, this.query, { _detail: this.row.filename })
      this.$router.replace({ query })
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
  </td>
  `
}

export default {
  props: ['cfg', 'query'],
  components: { FileActions },
  template: `
  <ACListView :query="query" :cfg="cfg">

    <template v-slot:breadcrumb="{ cfg }">
      <b-breadcrumb-item active>media</b-breadcrumb-item>
    </template>

    <template v-slot:tbody="{ items, fields }">

      <tr v-for="row,rowidx in items" :key="rowidx">
        <td>{{ row.filename }}</td>
        <td>{{ row.nazev }}</td>
        <td>{{ row.tags }}</td>
        <td>{{ row.ctype }}</td>
        <td>{{ row.size }}</td>        
        <FileActions key="actions" :query="query" :row="row" :cfg="cfg" />
      </tr>

    </template>
  </ACListView>
  `
}