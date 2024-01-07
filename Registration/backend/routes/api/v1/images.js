const express = require('express')
const router = express.Router()
const { downloadDirectory } = require('./../../../firebase/storage/storage')

// corsを許可する
const cors = require('cors')
router.use(cors())

/**
 ** クライアントから指定されたIDの画像を取得してクライアントに返すエンドポイント
 *
 * このエンドポイントは、クライアントサイドからリクエストを受け取ったら
 * 画像を取得してクライアントに返します。
 * 画像は Firebase の Cloud Storage から取得します。
 *
 *
 * @function
 * @name GET /api/v1/images/
 * @memberof module:routes/api/v1/images
 * @param {Object} req - Expressリクエストオブジェクト
 * @param {Object} res - Expressレスポンスオブジェクト
 * @param {string} req.params.liveId - ライブID
 * @param {Object} gotData - 画像データ
 * @returns {Boolean} - 登録成功時はtrue、失敗時はfalseを返す
 */
router.get('/:liveId', async (req, res) => {
  // liveIdを取得
  const liveId = req.params.liveId
  try {
    // 画像データを取得 (Cloud Storage から)
    const gotData = await downloadDirectory(liveId)
    res.status(200).json(gotData)
  } catch {
    res.status(500).send('Error getting document')
  }
})

module.exports = router
