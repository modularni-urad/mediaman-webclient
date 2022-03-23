
export default {
  props: ['cfg', 'query'],
  template: `
  <ACListView :query="query" :cfg="cfg">

    <template v-slot:breadcrumb="{ cfg }">
      <b-breadcrumb-item active>media</b-breadcrumb-item>
    </template>

  </ACListView>
  `
}