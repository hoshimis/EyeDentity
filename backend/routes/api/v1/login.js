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
 * @returns {str} - パスワードが合致したらHTMLを返す、無かったらエラーを返す
 */
router.post('/', async (req, res) => {
  // liveIdを取得
  const liveId = req.body.liveId
  const pass = req.body.pass
  try {
    // Firebase FireStore内のドキュメントにアクセス
    const gotData = getDocumentData('liveInfo', liveId)
    // 取得したデータ内のパスワードを抽出
    const gotPass = gotData.deletePassword
    if (pass == gotPass) {
      // パスワードが合致したらHTMLを返す
      const html = `
      <!DOCTYPE html>
      <html>

      <head>
        <title>ライブ情報の登録</title>
        <style>
          form {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
          }

          input[type="text"],
          input[type="date"],
          input[type="time"],
          input[type="submit"] {
            margin: 10px;
            padding: 5px;
            border-radius: 5px;
            border: none;
            box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
            font-size: 16px;
            width: 300px;
          }

          input[type="submit"] {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          input[type="submit"]:hover {
            background-color: #3e8e41;
          }
        </style>
      </head>

      <body>
        <form action="http://127.0.0.1:3000/api/v1/edit" method="POST">
          <label for="liveName">ライブ名称:</label>
          <input type="text" id="liveName" name="liveName"  value="${gotData.liveName}"required>

          <label for="date">日付:</label>
          <input type="date" id="date" name="date" value="${gotData.date}" required>

          <label for="time">時間:</label>
          <input type="time" id="time" name="time" value="${gotData.time}" required>

          <label for="venue">会場:</label>
          <input type="text" id="place" name="place" value="${gotData.place}"  required>

          <label for="description">説明:</label>
          <input type="text" id="description" name="description" value="${gotData.description}" required>

          <label for="deadline">申し込み締め切り:</label>
          <input type="text" id="deadline" name="deadline" value="${gotData.deadline}" required>

          <label for="edit">編集用パスワード:</label>
          <input type="text" id="edit" name="edit" value="${gotData.deletePassword}" required>

          <input type="submit" value="登録">
        </form>
      </body>

      </html>
      `
      res.status(200).send(html)
    } else {
      // パスワードが合致しなかったらエラーを返す
      res.status(500).send('Error getting document')
    }
  } catch {
    res.status(500).send('Error getting document')
  }
})

module.exports = router
