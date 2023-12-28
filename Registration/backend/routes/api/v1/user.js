const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const { uploadDirectory } = require('../../../firebase/storage/storage')


const cors = require('cors')
router.use(cors())

router.post('/', (req, res) => {
  // ファイルのアップロード先のディレクトリを指定
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // tmpディレクトリに保存
      cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })

  // ファイルのアップロード設定
  const upload = multer({ storage: storage }).single('uploadFile')

  // ファイルのアップロードを実行
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({ success: false, error: err })
      console.log(err)
    } else {
      const id = req.body.id || 'test'

      console.log("liveId: " + id)
      // ファイル名を変更
      const oldPath = path.join('uploads/', req.file.filename)
      const newPath = path.join('uploads/', id + '.mp4')
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          res.status(500).json({ success: false, error: err })
        } else {
          // TODO: redirect が うまくできない
          // TODO: 動画を送信した後の挙動が送信した感がないのでそれらしくする
          // TODO: 例) 送信完了画面を表示する or 送信完了のアラートを出す
          res.status(200).redirect('/')
          console.log('File uploaded successfully.')

          /**
           * Python プロセスを起動して動画を細かく分割する
           *
           * @type {ChildProcess}
           */
          const pythonProcess = spawn('python', [
            './python/video_to_images.py', // Pythonファイルのパス
            `./uploads/${id}.mp4`, // 動画のパス
            './source_images/', // 画像の保存先
            // TODO: ここで名前を指定する
            // TODO: 名前の値は現状はフリガナにしているがそれでも動くかどうか確認する → 太陽さんに確認
            'name', // 対象者の名前
            id // 動画のID (ファイル名)
          ])
          pythonProcess.stdout.on('data', (data) => {
            console.log(data.toString())
          })
          pythonProcess.stderr.on('data', (data) => {
            console.log(data.toString())
          })
          pythonProcess.on('close', async (code) => {
            console.log(`child process exited with code ${code}`)

            // 画像のアップロードを実行
            await uploadDirectory(`./source_images/${id}`, `${id}`).then(
              (result) => {
                console.log('分割画像のアップロードに成功しました。:' + result)
              }
            )

            // 動画を削除
            fs.access(`./uploads/${id}.mp4`, fs.constants.F_OK, (err) => {
              if (err) {
                console.error(`File ./uploads/${id}.mp4 does not exist.`)
              } else {
                fs.rm(`./uploads/${id}.mp4`, (err) => {
                  if (err) {
                    console.error(err)
                  } else {
                    console.log(`./uploads/${id}.mp4 was deleted`)
                  }
                })
              }
            })

            // 分割した画像を削除
            fs.access(`./source_images/${id}/`, fs.constants.F_OK, (err) => {
              if (err) {
                console.error(
                  `Directory ./source_images/${id}/ does not exist.`
                )
              } else {
                fs.rm(`./source_images/${id}/`, { recursive: true }, (err) => {
                  if (err) {
                    console.error(err)
                  } else {
                    console.log(`./source_images/${id}/ was deleted`)
                  }
                })
              }
            })
          })
        }
      })
    }
  })
})

module.exports = router
