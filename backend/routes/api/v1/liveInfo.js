const express = require('express')
const router = express.Router()
const dbOperations = require('./../../../firebase/db/dbOperations')

// corsを許可する
const cors = require('cors')
router.use(cors())

/**
 ** ライブの情報をDBから取得してクライアントに返すエンドポイント
 *
 * このエンドポイントは、クライアントサイドからリクエストを受け取ったら
 * ライブ登録情報をFirestoreから受け取ってクライアントに返します。
 *
 * @function
 * @name POST /api/v1/liveInfo/
 * @memberof module:routes/api/v1/liveInfo
 * @param {Object} req - Expressリクエストオブジェクト
 * @param {Object} res - Expressレスポンスオブジェクト
 * @param {string} req.params.liveId - ライブID
 * @param {Object} gotData - ライブ登録情報
 * @returns {Boolean} - 登録成功時はtrue、失敗時はfalseを返す
 */
router.get('/:liveId', async (req, res) => {
  // liveIdを取得
  const liveId = req.params.liveId
  try {
    const gotData = await dbOperations.getDocumentData('liveInfo', liveId)
    console.log(gotData)
    res.status(200).json(gotData)
  } catch {
    res.status(500).send('Error getting document')
  }
})

module.exports = router
