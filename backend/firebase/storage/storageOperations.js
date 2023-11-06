const bucket = require('./storage')

// 画像を受け取ってアップロードする関数
async function uploadImageToStorage(filePath, destination) {
  return new Promise((resolve, reject) => {
    upload(filePath, destination, async (err) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      const file = bucket.file(filePath)
      const result = await file.save()
      const url = result[0].metadata.mediaLink
      resolve(url)
    })
  })
}

module.exports = {
  uploadImageToStorage,
}
