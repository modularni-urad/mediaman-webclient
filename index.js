import MediaManager from './src/manager.js'
import formconfig from './src/formconfig.js'
import { loadAsBase64 } from './src/fileForm.js'

const ROUTENAME = 'medias'
const ADMIN_GROUP = 'mediaman'

export function createMenu (user) {
  return user.groups.indexOf(ADMIN_GROUP) >= 0
    ? { label: 'media', to: { name: ROUTENAME } }
    : null
}

export async function setupRoutes (routes, path, cfg, initConfig) {

  Object.assign(cfg, { 
    conf: formconfig,
    default_sort: 'filename:asc',
    getLoadUrl: function (itemId, self) {
      return `${self.cfg.url}?filter=${JSON.stringify({ filename: itemId })}`
    },
    getSaveUrl: (currItem, self) => {
      return currItem ? `${self.cfg.url}${self.query._detail}` : self.cfg.url
    },
    prepareData: function (data) {
      const prepared = _.omit(data, 'file')
      if (data.file) {        
        Object.assign(prepared, {
          ctype: data.file.type,
          size: data.file.size,
          filename: data.file.name
        })
      }
      return prepared
    },
    finishSave: async function (data, result, self) {
      const content = await loadAsBase64(data.file)
      await self.$store.dispatch('send', { 
        method: 'post', 
        url: `${self.cfg.upload_url}/${result[0].filename}`,
        data: { content }
      })
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
}

export const List = MediaManager