import FolderList from './folderlist.js'
import FileActions from './fileactions.js'
import AddButton from './add_button.js'

export default {
  props: ['cfg', 'query'],
  components: { FileActions, FolderList, AddButton },
  computed: {
    breadcrumsItems: function () {
      return this.query.path ? this.query.path.split('/') : []
    }
  },
  methods: {
    onFolderClick: function (i) {
      const path = this.query.path 
        ? this.query.path + '/' + i.name
        : i.name 
      const query = Object.assign({}, this.query, { path })
      this.$router.replace({ query })
    },
    goTo: function (i) {
      const idx = this.breadcrumsItems.indexOf(i)
      const path = this.breadcrumsItems.slice(0, idx + 1).join('/')
      const query = Object.assign({}, this.query, { path })
      this.$router.replace({ query })
    }
  },
  template: `
  <ACListView :query="query" :cfg="cfg">

    <template v-slot:breadcrumb="{ cfg }">
      <b-breadcrumb-item :active="breadcrumsItems.length === 0" @click="goTo()">
        media
      </b-breadcrumb-item>
      <b-breadcrumb-item 
        v-for="i,idx in breadcrumsItems" :key="i" 
        @click="goTo(i)"
        :active="idx === breadcrumsItems.length - 1"
      >
        {{ i }}
      </b-breadcrumb-item>
    </template>

    <template v-slot:rightcontrols="{ cfg }">
      <AddButton :cfg="cfg" :query="query" />
    </template>

    <template v-slot:middle="{ cfg }">
      <FolderList style="clear: both;" :cfg="cfg" :query="query" :onSelect="onFolderClick" />
    </template>

    <template v-slot:tbody="{ items, fields, doEdit }">

      <tr v-for="row,rowidx in items" :key="rowidx">
        <td>{{ row.filename }}</td>
        <td>{{ row.nazev }}</td>
        <td>{{ row.tags }}</td>
        <td>{{ row.ctype }}</td>
        <td>{{ row.size }}</td>        
        <FileActions key="actions" :query="query" :row="row" :cfg="cfg" :doEdit="doEdit" />
      </tr>

    </template>
  </ACListView>
  `
}