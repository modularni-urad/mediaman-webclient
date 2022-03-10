/* global Vue, Vuex, localStorage, API, axios, _ */

const KEY = '_opencomm_user_'

function _loadUser() {
  const u = localStorage.getItem(KEY)
  const user = u ? JSON.parse(u) : null
  return user
}
const isVector = (url) => url.match(/.*.svg$/)

export default (router, cfg) => (new Vuex.Store({
  state: {
    user: _loadUser(),
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
      localStorage.setItem(KEY, JSON.stringify(profile))
      state.user = profile
    }
  },
  actions: {
    toast: function (ctx, opts) {
      console.log('toast', JSON.stringify(opts))
    },
    onerror: function (ctx, err) {
      console.error(err)
    },
    send: function (ctx, opts) {
      Object.assign(opts, {  // for debug only
        headers: { 'Authorization': `Bearer bjbjbj`}
      })
      return axios(opts)
    }
  }
}))
