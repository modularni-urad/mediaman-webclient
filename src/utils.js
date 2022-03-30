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

  var options = {
    endpoint: cfg.uploadurl,
    metadata: {
      filename: `${tokenReq.data.path}/${filename}`,
      Bearer: tokenReq.data.token
    },
    uploadSize: fileObject.size,
    onError (error) {
      uploadItem.status = error.toString()
    },
    onProgress: function(bytesUploaded, bytesTotal) {
      uploadItem.progress = (bytesUploaded / bytesTotal * 100).toFixed(2)
    },
    onSuccess: async function () {
      self.$store.dispatch('send', { 
        method: 'post', 
        url: cfg.url,
        data: { filename, nazev: fileObject.name }
      })
      self.$store.dispatch('toast', {
        message: `soubor nahrán: ${fileObject.name}`,
        type: 'success'
      })
      uploadItem.status = 'done'
    }
  }
  
  var upload = new window.tus.Upload(fileObject, options)
  upload.start()
}