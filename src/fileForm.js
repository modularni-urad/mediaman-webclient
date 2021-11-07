

export async function prepareFileFormData(data) {
  if (!data.file) return data
  const content = await loadAsBase64(data.file)
  data.file = _.pick(data.file, 'type', 'name')
  data.file.content = content
  return data
}

export function loadAsBase64(theFile) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()

    reader.onload = function(loadedEvent) {
        var arrayBuffer =  new Uint8Array(loadedEvent.target.result)
        const r = arrayBuffer.reduce((data, byte) => data + String.fromCharCode(byte), '') 
        resolve(btoa(r))
    }

    reader.readAsArrayBuffer(theFile)
  })
}