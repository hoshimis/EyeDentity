const express = require('express')
const router = express.Router()
const multer = require('multer')

const { exec } = require('child_process')

// Python の ファイルパスを指定
const pythonFilePath = './python/main.py'

// ファイルのアップロード先のディレクトリを指定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/') // tmpディレクトリに保存
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname)
    const filename = path.basename(file.originalname, extension)
    cb(null, `video_${filename}${extension}`)
  },
})

// ファイルのアップロード設定
const upload = multer({ storage: storage })

// 動画を受け取って細かく分割した画像を生成する関数
async function convertVideoToImages(videoPath) {
  return new Promise((resolve, reject) => {
    // Pythonスクリプトを実行
    const pythonProcess = exec(
      `python ${pythonFilePath} ${videoPath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`)
          reject(error)
        }
        if (stderr) {
          console.error(`Error: ${stderr}`)
          reject(stderr)
        }
        console.log(`Python Output: ${stdout}`)
        resolve(stdout)
      }
    )

    // 完了したときの処理
    pythonProcess.on('exit', (code) => {
      console.log(`Python Process exited with code ${code}`)
    })
  })
}

/**
 * クライアントから送信されたユーザ情報（動画）を受け取り、
 * それらをコマ切りにして保存するエンドポイント
 *
 * このエンドポイントは、クライアントサイドからの
 * ユーザの動画をコマ切りにしてFirestoreに保存します。
 *
 * @function
 * @name POST /api/v1/user/
 * @memberof module:routes/api/v1/user
 * @param {Object} req - Expressリクエストオブジェクト
 * @param {Object} res - Expressレスポンスオブジェクト
 * @returns {Boolean} - 登録成功時はtrue、失敗時はfalseを返す
 */

router.post('/', upload.single('video'), (req, res) => {
  // TODO: 送信された動画を保存する処理を書く
  // TODO: 動画をコマ切りにして保存する処理を書く
  res.status(200).json({ success: true })
})

module.exports = router
