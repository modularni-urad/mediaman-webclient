/* global Vue, Vuex, localStorage, API, axios, _ */

const isVector = (url) => url.match(/.*.svg$/)

export default (router, cfg) => (new Vuex.Store({
  state: {
    user: null,
    router: router,
    cfg
  },
  getters: {
    userLogged: state => {
      return state.user !== null
    },
    UID: state => {
      const UID = state.router.currentRoute.query.uid || state.user.id
      return UID
    },
    isMember: state => group => {
      try {
        return state.user.groups.indexOf(group) >= 0
      } catch (_) {
        return false
      }
    },
    mediaUrl: (state) => (media, params = null) => {
      const murl = media.match(/^https?:\/\//) ? media : `${cfg.cdn}/${media}`
      if (isVector(murl) || (!params && !murl.match(/^https?:\/\//))) {
        // je to vektor, nebo nechci modifier
        return murl
      }
      return `${cfg.cdnapi}/resize/?url=${encodeURIComponent(murl)}&${params}`
    }
  },
  mutations: {
    profile: (state, profile) => {
      state.user = profile
    }
  },
  actions: {
    login: function (ctx, credentials) {
      const url = 'https://dev.modurad.otevrenamesta.cz/omstredni/auth/login/omesta?token=1'
      axios.post(url, credentials).then(res => {
        this.commit('profile', res.data)
      }).catch(err => this.dispatch('onerror', err))
    },
    toast: function (ctx, opts) {
      console.log('toast', JSON.stringify(opts))
    },
    onerror: function (ctx, err) {
      console.error(err)
    },
    send: function (ctx, opts) {
      ctx.state.user && Object.assign(opts, {  // for debug only
        headers: { 'Authorization': `Bearer ${ctx.state.user.token}`}
      })
      return axios(opts)
    }
  }
}))
