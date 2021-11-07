/* global Vue, _, moment */

Vue.filter('date', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY')
  }
})

Vue.filter('datetime', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
})

Vue.component('NameSpan', {
  props: ['uid', 'cfg'],
  template: `
    <span>User: {{ uid }}</span>
  `
})

Vue.component('user-select', {
  data(){
    return {
      query: '',
      users: []
    }
  },
  props: ['config', 'disabled', 'data'],
  methods: {
    lookupUser: function() {
      // in practice this action should be debounced
      fetch(`https://stredni.web.otevrenamesta.cz/api/userman/search?query=${this.query}`)
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.users = data
        })
    },
    select: function ($event) {
      const { data, config } = this.$props
      data[config.name] = $event.id
    },
    serialize: function (item) {
      return `${item.name} (${item.username})`
    }
  },
  components: { 'vue-typeahead-bootstrap': VueTypeaheadBootstrap },
  template: `
<validation-provider v-bind:rules="config.rules" v-slot="{ errors }">
  <b-form-group
    :state="errors.length === 0"
    :label="config.label"
    :invalid-feedback="errors[0]"
  >
    
    <vue-typeahead-bootstrap
      v-model="query"
      :disabled="disabled"
      :ieCloseFix="false"
      :data="users"
      :serializer="serialize"
      @hit="select"
      :placeholder="config.placeholder || 'prohledat uživatele'"
      @input="lookupUser"
      :background-variant-resolver="(user) => ((user.id % 2) == 0) ? 'light':'dark'"
    />

  </b-form-group>
</validation-provider>
  `
})