import MediaManager from './src/manager.js'
import AclManager from './src/acl_manager.js'
import formconfig from './src/formconfig.js'
import acl_formconfig from './src/acl_formconfig.js'

const ROUTENAME = 'medias'
const ADMIN_GROUP = 'mediaman'
const ACL_ROUTENAME = 'mediaman_acladmin'
const ACL_GROUP = 'acl_manager'

export function createMenu (user) {
  const items = []
  if (user.groups.indexOf(ADMIN_GROUP) >= 0) {
    items.push({ label: 'media', to: { name: ROUTENAME } })
  }
  if (user.groups.indexOf(ACL_GROUP) >= 0) {
    items.push({ label: 'acl admin', to: { name: ACL_ROUTENAME } })
  }
  return items.length > 0 ? items : null
}

export async function setupRoutes (routes, path, cfg, initConfig) {

  Object.assign(cfg, { 
    conf: formconfig,
    default_sort: 'filename:asc',
    getListUrl: function (self, params) {
      if (self.query.path) {
        const filter = { filename: { like: `${self.query.path}%` } }
        params.filter = params.filter 
          ? Object.assign(params.filter, filter)
          : filter
      }
      return self.cfg.url
    },
    getLoadUrl: function (item, self) {
      return `${self.cfg.url}?filter=${JSON.stringify({ filename: item.filename })}`
    },
    getSaveUrl: (item, self) => {
      return item ? `${self.cfg.url}/${item.filename}` : self.cfg.url
    }
  })

  await initConfig(cfg)

  routes.push({ 
    path, 
    name: ROUTENAME, 
    component: MediaManager, 
    props: route => {
      return { query: route.query, cfg }
    }
  })

  const aclCfg = {
    url: cfg.url + '/acl',
    conf: acl_formconfig,
    default_sort: 'uid:asc',
  }
  await initConfig(aclCfg)

  routes.push({ 
    path: path + 'acl', 
    name: ACL_ROUTENAME, 
    component: AclManager, 
    props: route => {
      return { query: route.query, aclCfg }
    }
  })
}

export const List = MediaManager