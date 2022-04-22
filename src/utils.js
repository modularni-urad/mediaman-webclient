const tus = import('https://cdn.jsdelivr.net/npm/tus-js-client@2.3.1/dist/tus.js')

export async function uploadFile (fileObject, uploadInfo, filename, token, uploadurl) {
  await tus
  Object.assign(uploadInfo, {
    size: fileObject.size,
    progress: 0,
    status: 'inprogress'
  })

  return new Promise((resolve, reject) => {
    var options = {
      endpoint: uploadurl,
      metadata: { filename, Bearer: token },
      chunkSize: 1024 * 1024 * 5, // 5MB
      uploadSize: fileObject.size,
      onError (error) {
        uploadInfo.status = error.toString()
        reject(error)
      },
      onProgress: function(bytesUploaded, bytesTotal) {
        uploadInfo.progress = (bytesUploaded / bytesTotal * 100).toFixed(2)
      },
      onSuccess: async function () {
        uploadInfo.status = 'done'
        resolve()
      }
    }
    new window.tus.Upload(fileObject, options).start()
  })  
}

export function alreadyExists (path, storageurl) {
  return axios.head(storageurl + path).then(res => {
    return res.status === 200
  }).catch(err => {
    return false
  })
}