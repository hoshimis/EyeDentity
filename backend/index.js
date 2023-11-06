const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

// ルートディレクトリパスの定義
const rootDir = `${path.resolve(__dirname, './')}`

// ルートディレクトリにtmpディレクトリを作成
const tmpDir = `${rootDir}/tmp`
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir)
}

// ミドルウェアの定義
app.use(express.urlencoded())
app.use(express.json())

// 各エンドポイントの定義, ルーティング
app.use('/api/v1/register', require('./routes/api/v1/register'))
app.use('/api/v1/liveinfo', require('./routes/api/v1/liveInfo'))
app.use('/api/v1/user', require('./routes/api/v1/user'))

// ルートの定義
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// サーバーの起動
app.listen(3000, () => {
  console.log('Server started on port 3000')
})
