const tus = import('https://cdn.jsdelivr.net/npm/tus-js-client@2.3.1/dist/tus.js')

export async function uploadFile (fileObject, uploadItem, filename, cfg, self, skipExistingTest = false) {
  const tokenReq = await self.$store.dispatch('send', { 
    method: 'get', 
    url: cfg.url + '/acl/token' 
  })
  await tus
  const finalFilename = `${tokenReq.data.path}/${filename}`

  if (!skipExistingTest) {
    try {
      const exists = await self.$store.dispatch('send', { 
        method: 'head', 
        url: cfg.storageurl + finalFilename
      })
      if (exists.status === 200) {
        const m = `${filename}: soubor již existuje, použijte tlačítko "přepsat"`
        throw new Error(m)
      }
    } catch (err) {
      if (!(err.response && err.response.status === 404)) {
        throw err
      }
      // ok to continue with 404
    }  
  }
  
  Object.assign(uploadItem, {
    size: fileObject.size,
    progress: 0,
    status: 'inprogress'
  })

  return new Promise((resolve, reject) => {
    var options = {
      endpoint: cfg.uploadurl,
      metadata: {
        filename: finalFilename,
        Bearer: tokenReq.data.token
      },
      uploadSize: fileObject.size,
      onError (error) {
        uploadItem.status = error.toString()
        reject(error)
      },
      onProgress: function(bytesUploaded, bytesTotal) {
        uploadItem.progress = (bytesUploaded / bytesTotal * 100).toFixed(2)
      },
      onSuccess: async function () {
        resolve(filename)
        uploadItem.status = 'done'
      }
    }

    var upload = new window.tus.Upload(fileObject, options)
    upload.start()
  })
  
}