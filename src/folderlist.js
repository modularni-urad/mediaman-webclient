const forbidden = ['_webdata']

export default {
  data: () => {
    return {
      found: [],
      loading: true
    }
  },
  props: ['cfg', 'query', 'onSelect'],
  async created () {
    const path = this.query.path || ''
    const res = await axios.get(this.$store.state.cfg.cdn + path)
    this.$data.found = res.data.filter(i => i.type === "directory" && forbidden.indexOf(i.name) < 0)
    this.$data.loading = false
  },
  template: `
  <div class="py-2">
    <a v-for="i in found" 
      @click.prevent="onSelect(i)"
      style="margin: 0 1em;"
    >
      <img src="https://cdn.onlinewebfonts.com/svg/img_248940.png" style="width: 3em;" />
      <span>{{ i.name }}</span>
    </a>
  </div>
  `
}