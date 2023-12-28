const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

// corsを許可する
const cors = require("cors");
router.use(cors());

/**
 ** クライアントから指定されたIDの画像を取得してクライアントに返すエンドポイント
 *
 * このエンドポイントは、クライアントサイドからリクエストを受け取ったら
 * 画像を取得してクライアントに返します。
 * 画像は Firebase の Cloud Storage から取得します。
 *
 *
 * @function
 * @name GET /api/v1/training/
 * @memberof module:routes/api/v1/training
 * @param {Object} req - Expressリクエストオブジェクト
 * @param {Object} res - Expressレスポンスオブジェクト
 * @param {string} req.params.liveId - ライブID
 * @returns {Boolean} - 登録成功時はtrue、失敗時はfalseを返す
 */
router.get("/:liveId", async (req, res) => {
  // liveIdを取得
  const id = req.params.liveId;
  res.status(200).json(id);

  // Python   を呼ぶ
  // Node -> Python
  const pythonProcess = spawn("python", [
    "./python/facetraining.py", // Pythonファイルのパス
    id,
  ]);
  pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  pythonProcess.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  pythonProcess.on("close", async (code) => {
    console.log(`child process exited with code ${code}`);
  });

  // user に　ymlを渡したい
});

module.exports = router;
