const express = require('express')
const router = express.Router()
const { getDocumentData } = require('./../../../firebase/db/dbOperations')

// corsを許可する
const cors = require('cors')
router.use(cors())

/**
 ** クライアントから指定されたIDのFireStoreのドキュメントにアクセスし、Passと合致したらHTMLを返すエンドポイント
 *
 * このエンドポイントは、クライアントサイドからリクエストを受け取ったら
 * リクエスト内のIDをもとにFireStoreのドキュメントにアクセスし、
 * ドキュメント内のPassとリクエスト内のPassが合致したらHTMLを返します。
 *
 *
 * @function
 * @name POST /api/v1/login/
 * @memberof module:routes/api/v1/login
 * @param {Object} req - Expressリクエストオブジェクト
 * @param {Object} res - Expressレスポンスオブジェクト
 * @param {string} req.params.liveId - ライブID
 * @param {string} req.params.pass - パスワード
 * @returns {str} - パスワードが合致したらHlMLを返す、無かったらエラーを返す
 */
router.post('/', async (req, res) => {
  // liveIdを取得
  const liveId = req.body.liveId
  const pass = req.body.pass

  console.log(liveId)
  console.log(pass)

  try {
    // Firebase FireStore内のドキュメントにアクセス
    const gotData = await getDocumentData('liveInfo', liveId)
    // 取得したデータ内のパスワードを抽出
    const gotPass = gotData.deletePassword

    // htmlに渡すデータを定義
    const htmlData = {
      liveId: liveId,
      liveName: gotData.liveName,
      date: gotData.date,
      time: gotData.time,
      place: gotData.place,
      description: gotData.description,
      deadline: gotData.deadline,
      deletePassword: gotData.deletePassword
    }
    if (pass == gotPass) {
      // パスワードが合致したらHTMLを返す
      res.status(200).render('edit', htmlData)
    } else {
      // パスワードが合致しなかったらエラーを返す
      res.status(500).send('Error getting document')
    }
  } catch {
    res.status(500).send('Error getting document')
  }
})

module.exports = router
