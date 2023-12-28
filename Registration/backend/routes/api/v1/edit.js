const express = require('express')
const router = express.Router()
const { editDocument } = require('./../../../firebase/db/dbOperations')

const cors = require('cors')
router.use(cors())

/**
 ** クライアントから指定されたIDのライブを編集するエンドポイント
 * @function
 * @name POST /api/v1/edit/
 * @memberof module:routers//api/v1/edit/:liveId
 * @param {Object} req - Expressリクエストオブジェクト
 * @param {Object} res - Expressレスポンスオブジェクト
 * @param {liveId} - 編集を行うライブのID
 * @param {liveData} - 編集後のライブ情報
 */

router.post('/:liveId', async (req, res) => {
  const liveId = req.params.liveId
  const liveData = req.body

  console.log('liveId: ', liveId)
  console.log('liveData: ', liveData)
  try {
    // ライブIDを指定してライブ情報を更新
    const gotData = await editDocument('liveInfo', liveId, liveData)
    res.status(200).send('更新が完了しました。')
    console.log('更新が完了しました。')
  } catch {
    res.status(500).send('更新が失敗しました。')
    console.log('更新が失敗しました。')
  }
})

module.exports = router
