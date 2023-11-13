const { getDownloadURL, getStorage } = require('firebase-admin/storage')

const bucket = getStorage().bucket()

/**
 * Firebase Storage に 場所を指定して画像をアップロードします。
 *
 * @param {string} filePath - アップロードするファイルのパス
 * @param {string} destination - アップロード先の場所
 * @returns {Promise<void>} - アップロードが成功したら、Promiseがresolveされます。
 */
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

/**
 * Firebase Storage から 場所を指定して画像をダウンロードします。
 *
 * @param {string} fileLocation - ダウンロードするファイルの場所
 * @returns {Promise<string>} - ダウンロードしたファイルのURLをPromiseで返します。
 */
async function downloadFile(fileLocation) {
  try {
    const url = await getDownloadURL(`gs://${bucket.name}/${fileLocation}`)
    console.log(`Downloaded file from ${fileLocation}.`)
    return url
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

module.exports = { uploadFile, downloadFile }
