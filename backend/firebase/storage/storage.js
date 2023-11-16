const { getStorage } = require('firebase-admin/storage')
const fs = require('fs')
const path = require('path')

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
 * Firebase Storage に ディレクトリを指定して画像をアップロードします。
 *
 * @param {string} directoryPath - アップロードするファイルが含まれるディレクトリのパス
 * @param {string} destination - アップロード先の場所
 * @returns {Promise<void>} - アップロードが成功したら、Promiseがresolveされます。
 */
async function uploadDirectory(directoryPath, destination) {
  try {
    const files = await fs.promises.readdir(directoryPath)
    for (const file of files) {
      const filePath = path.join(directoryPath, file)

      // destinationに含まれる末尾のスラッシュを削除
      const sanitizedDestination = destination.replace(/\/$/, '')

      const fileDestination = `${destination}/${file}`
      await bucket.upload(filePath, {
        destination: fileDestination,
      })
    }
  } catch (error) {
    console.error('Error uploading directory:', error)
  }
}

/**
 * Firebase Cloud Storage から指定されたディレクトリを再帰的にダウンロードします。
 *
 * @param {string} remotePath - ダウンロードするディレクトリの場所
 * @param {string} localPath - ダウンロードしたファイルを保存するローカルディレクトリのパス
 * @returns {Promise<void>} - ダウンロードが成功したら、Promiseがresolveされます。
 */
async function downloadDirectory(directoryPath) {
  console.log('Downloading files from Firebase Storage...')
  try {
    // ディレクトリ内のオブジェクト一覧を取得
    const [files] = await bucket.getFiles({
      prefix: directoryPath,
    })

    // ディレクトリが存在しない場合は終了
    if (files.length === 0) {
      console.log('Directory not found.')
      return
    }

    // ダウンロード先のディレクトリを作成
    const downloadDirectory = path.join(
      __dirname,
      '..',
      '..',
      'downloads',
      directoryPath
    )
    fs.mkdirSync(downloadDirectory, { recursive: true })

    // ディレクトリ内の各オブジェクトをダウンロード
    for (const file of files) {
      const destination = path.join(downloadDirectory, path.basename(file.name))
      await file.download({ destination })
      console.log(`Downloaded: ${file.name}`)
    }

    console.log('Download completed.')
  } catch (error) {
    console.error('Error downloading objects:', error)
  }
}

module.exports = {
  uploadFile,
  uploadDirectory,
  downloadDirectory,
}
