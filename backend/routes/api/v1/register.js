const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const dbOperations = require('./../../../firebase/db/dbOperations')


const cors = require('cors')
router.use(cors())

/**
 ** ライブの情報を受け取りFirestoreに返すエンドポイント
 *
 * このエンドポイントは、クライアントサイドからの
 * ライブ登録情報を受け取ってFirestoreに保存します。
 *
 * @function
 * @name POST /api/v1/register/
 * @memberof module:routes/api/v1/register
 * @param {Object} req - Expressリクエストオブジェクト
 * @param {Object} res - Expressレスポンスオブジェクト
 * @param {string} req.body.liveName - ライブ名
 * @param {string} req.body.date - 日付
 * @param {string} req.body.time - 時間
 * @param {string} req.body.place - 場所
 * @param {string} req.body.description - 説明
 * @param {string} req.body.deadline - 締め切り
 * @param {string} req.body.deletePassword - 削除パスワード
 * @param {string} liveId - ライブID
 * @param {Object} data - ライブ登録情報
 * @returns {Boolean} - 登録成功時はtrue、失敗時はfalseを返す
 */
router.post('/', async (req, res) => {
  // 送信されたデータを取得
  const liveName = req.body.liveName
  const date = req.body.date
  const time = req.body.time
  const place = req.body.place
  const description = req.body.description
  const deadline = req.body.deadline
  const deletePassword = req.body.deletePassword

  // DBに登録するデータを作成
  const data = {
    liveName: liveName,
    date: date,
    time: time,
    place: place,
    description: description,
    deadline: deadline,
    deletePassword: deletePassword,
  }

  // liveIdの生成
  const inputString = liveName + date + time + place + description + deadline
  const hash = crypto.createHash('sha256').update(inputString).digest('hex')
  // 短くするために10文字にする
  const liveId = hash.slice(0, 10)
  try {
    await dbOperations.addToDocument('liveInfo', liveId, data)
    res.send(JSON.stringify({ liveId: liveId }))
  } catch {
    console.error('Error adding document')
    res.status(500).send('Error adding document')
  }
})

module.exports = router
