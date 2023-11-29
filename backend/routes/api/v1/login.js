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
    console.log(gotData.deletePassword)
    const gotPass = gotData.deletePassword
    if (pass == gotPass) {
      // パスワードが合致したらHTMLを返す
      const html = `
      <!DOCTYPE html>
      <html>

      <head>
        <title>ライブ情報の登録</title>
        <style>
        @media screen and(max-width: 480px) {
          img {
          border: 0;
          }
          }
      @media screen and(min-width: 1280px) {
          img {
          border: 1px solid red;
          }
      }
      body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          margin: 0;
          padding: 0;
      }
      .html {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: rgb(139, 240, 176);
      }
      form {
          text-align: center;
      }
      input[type="date"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 100%;
          margin: 10px 0;
      }
      input[type="text"] {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 100%;
          margin: 10px 0;
      }

      label[for="eventLocation"],input[type="text#eventLocation"] {
          display: block;
          margin-top: 10px;
      }

      label[for="eventDescription"], textarea#eventDescription {
          display: block;
          margin-top: 10px;
          width: 100%;
      }

      label[for="deadline"], input[type="date#deadline"] {
          display: block;
          margin-top: 10px;
      }
      label[for="DeletePassword"],input[type="text#eventLocation"] {
          display: block;
          margin-top: 10px;
      }
      #CoppyButton{
          margin-right: 300px;
      }

      .create-button {
          background-color: #00c6ff;
          color: #fff;
          padding: 15px 30px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 30px;
      }
      .back-button {
          text-decoration: none;
          color: #00c6ff; /* 青いテキスト */
          background: transparent; /* 背景を透明にする */
          padding: 5px 10px;
          border: 1px solid #00c6ff; /* ボーダーを追加 */
          border-radius: 5px;
          margin-top: 20px;
          margin-right: 300px;
          display: inline-block;
          transition: background 0.3s, color 0.3s;
      }

        </style>
      </head>

      <body>
        <form action="http://127.0.0.1:3000/api/v1/edit/${liveId}" method="POST">
          <label for="liveName">ライブ名称:</label>
          <input type="text" id="liveName" name="liveName"  value="${gotData.liveName}"required>

          <label for="date">日付:</label>
          <input type="date" id="datepicker" name="date" value="${gotData.date}" required>

          <label for="time">時間:</label>
          <input type="time" id="eventTime"class="eventTime" name="time" value="${gotData.time}" required>

          <label for="venue">会場:</label>
          <input type="text" id="place" id="eventLocation"  name="place" value="${gotData.place}"  required>

          <label for="description">説明:</label>
          <input type="text" id="description" name="description" value="${gotData.description}" required>

          <label for="deadline">申し込み締め切り:</label>
          <input type="text" id="deadline" name="deadline" value="${gotData.deadline}" required>

          <label for="edit">編集用パスワード:</label>
          <input type="text" id="deletePassword" name="deletePassword" value="${gotData.deletePassword}" required>

          <input type="submit" value="編集">
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
