const tus = import('https://cdn.jsdelivr.net/npm/tus-js-client@2.3.1/dist/tus.js')

export async function uploadFile (fileObject, uploadItem, filename, cfg, self) {
  const tokenReq = await self.$store.dispatch('send', { 
    method: 'get', 
    url: cfg.url + '/acl/token' 
  })
  await tus
  
  Object.assign(uploadItem, {
    size: fileObject.size,
    progress: 0,
    status: 'inprogress'
  })

  const tenant = cfg.url.split('/').slice(-2)[0]
  var options = {
    endpoint: cfg.uploadurl,
    metadata: {
      filename: `/${tenant}/${filename}`,
      Bearer: tokenReq.data
    },
    uploadSize: fileObject.size,
    onError (error) {
      uploadItem.status = error.toString()
    },
    onProgress: function(bytesUploaded, bytesTotal) {
      uploadItem.progress = (bytesUploaded / bytesTotal * 100).toFixed(2)
    },
    onSuccess: async function () {
      const dataReq = await axios.head(`${cfg.storageurl}/${tenant}/${filename}`)
      self.$store.dispatch('send', { 
        method: 'post', 
        url: cfg.url,
        data: { 
          filename, 
          nazev: fileObject.name, 
          ctype: dataReq.headers['content-type'], 
          size: dataReq.headers['content-length'] 
        }
      })
      uploadItem.status = 'done'
    }
  }
  
  var upload = new window.tus.Upload(fileObject, options)
  upload.start()
}