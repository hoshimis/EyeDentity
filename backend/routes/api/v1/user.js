const express = require('express')
const router = express.Router()
const multer = require('multer')
const { spawn } = require('child_process')
const uploadFile = require('../../../firebase/storage/storage')

router.post('/', (req, res) => {
  console.log('upload start')
  console.log(JSON.stringify(req.body))

  // ファイルのアップロード先のディレクトリを指定
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // tmpディレクトリに保存
      cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
      // ファイル名をidとして保存
      const filename = req.body.id + '.mp4'

      cb(null, filename)
    },
  })

  // ファイルのアップロード設定
  const upload = multer({ storage: storage }).single('video')

  // ファイルのアップロードを実行
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({ success: false, error: err })
    } else {
      // ファイルのアップロードに成功したら、ファイルのIDを返す
      const id = req.body.id || 'test'
      res.status(200).json({ success: true, id: id })
    }
  })

  console.log('upload done')
  console.log('ここからPythonプロセスを起動します')

  // Python プロセスを起動して動画を細かく分割する
  // Python プロセスを起動
  // 引数で渡すパスはPythonから見た相対パス
  // const pythonProcess = spawn('python', [
  //   './python/video_to_images.py',
  //   `./uploads/${id}.mp4`, // 動画のパス
  //   './source_images/', // 画像の保存先
  //   id, // 動画のID (ファイル名)
  // ])
  // pythonProcess.stdout.on('data', (data) => {
  //   console.log(data.toString())
  // })
  // pythonProcess.stderr.on('data', (data) => {
  //   console.log(data.toString())
  // })
  // pythonProcess.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`)
  // })

  // TODO: 分割した画像をCloudStorageにアップロードする
})

module.exports = router
