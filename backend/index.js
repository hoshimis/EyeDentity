const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

// Template Engineの設定
app.set('views', path.join(__dirname, 'views'))

// HTMLフォルダの指定
app.set('views', 'views')

// テンプレートエンジンにEJSを指定
app.set('view engine', 'ejs')

// ミドルウェアの定義
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ルートディレクトリパスの定義
const rootDir = `${path.resolve(__dirname, './')}`

// ルートディレクトリにuploadsディレクトリを作成
const tmpDir = `${rootDir}/uploads`
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir)
}

// 各エンドポイントの定義, ルーティング
app.use('/api/v1/register', require('./routes/api/v1/register'))
app.use('/api/v1/liveinfo', require('./routes/api/v1/liveInfo'))
app.use('/api/v1/user', require('./routes/api/v1/user'))
app.use('/api/v1/images', require('./routes/api/v1/images'))
app.use('/api/v1/login', require('./routes/api/v1/login'))
app.use('/api/v1/edit', require('./routes/api/v1/edit'))

// ルートの定義
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// サーバーの起動
app.listen(3000, () => {
  console.log('Server started on port 3000')
})
