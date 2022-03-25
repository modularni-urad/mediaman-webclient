import {uploadFile} from './utils.js'

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
        const filename = subpath ? 
          `${subpath.replace(/^\//, '').replace(/\/$/, '')}/${f.name}` 
          : f.name
        const upload = {filename, size: 0, progress: 0, status: '' }
        uploadFile(f, upload, filename, this.cfg, this)
        this.files.push(upload)
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