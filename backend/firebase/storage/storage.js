const { getDownloadURL, getStorage } = require('firebase-admin/storage')

const bucket = getStorage().bucket()

// 画像を受け取ってアップロードする関数
// ファイルをアップロードする関数
async function uploadFile(filePath, destination) {
  try {
    await bucket.upload(filePath, {
      destination: destination,
    })
    console.log(`${filePath} uploaded to ${destination}.`)
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}

module.exports = uploadFile
