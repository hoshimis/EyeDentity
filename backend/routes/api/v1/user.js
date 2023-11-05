const express = require('express')
const router = express.Router()

const { exec } = require('child_process')

// Python の ファイルパスを指定
const pythonFilePath = './python/main.py'

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

router.get('/', (req, res) => {
  // TODO: 動画をコマ切りにして保存する処理を書く

  // Pythonスクリプトを実行
  const pythonProcess = exec(
    `python ${pythonFilePath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`Error: ${stderr}`)
        return
      }
      console.log(`Python Output: ${stdout}`)
    }
  )

  // 完了したときの処理
  pythonProcess.on('exit', (code) => {
    console.log(`Python Process exited with code ${code}`)
  })

  res.json(users)
})

module.exports = router
