import { uploadFile, alreadyExists } from './utils.js'

export default {
  data: () => {
    return {
      files: [],
      subpath: ''
    }
  },
  props: ['cfg', 'query'],
  methods: {
    uploadFiles: async function (event) {
      for(var i = 0; i < event.target.files.length; i++) {
        const f = event.target.files[i]
        const subpath = `${this.query.path}/${this.subpath}`.replace(/\/\//, '/')
        const filename = (this.query.path || this.subpath) ? 
          `${subpath.replace(/^\//, '').replace(/\/$/, '')}/${f.name}` 
          : f.name
        try {
          const tokenReq = await this.$store.dispatch('send', { 
            method: 'get', 
            url: this.cfg.url + '/acl/token' 
          })
          const finalFilename = `${tokenReq.data.path}/${filename}`
          const exists = await alreadyExists(finalFilename, this.cfg.storageurl)
          if (exists) {
            const m = `${filename}: soubor již existuje, použijte tlačítko "přepsat"`
            throw new Error(m)
          }
          const upload = {filename, size: 0, progress: 0, status: '' }
          this.files.push(upload)
          await uploadFile(f, upload, finalFilename, tokenReq.data.token, this.cfg.uploadurl)
          await this.$store.dispatch('send', { 
            method: 'post', 
            url: this.cfg.url,
            data: { filename, nazev: f.name }
          })
          this.$store.dispatch('toast', {
            message: `soubor nahrán: ${f.name}`,
            type: 'success'
          })
        } catch (err) {
          this.$store.dispatch('onerror', { err })
        }
      }
    }
  },
  template: `
  <form>
    <table>
      <tr v-for="i,idx in files" :key="idx">
        <td>{{ i.filename }}</td>
        <td>{{ i.size }}</td>
        <td>{{ i.status }}</td>
        <td><input type="range" :value="i.progress" min="0" max="100" disabled> {{ i.progress }}%</td>
      </tr>
    </table>
    <hr />
    <input type="" v-model="subpath" placeholder="podsložka pro nová data" />
    <input type="file" multiple @change="uploadFiles" />
  </form>
  `
}