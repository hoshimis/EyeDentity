const express = require('express')
const app = express()
const dbOperations = require('./db/dbOperations')

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

app.get('/test-get', async (req, res) => {
  // データの取得処理
  try {
    const getedData = await dbOperations.getCollectionData('test')
    res.send(getedData)
  } catch (error) {
    res.status(500).send('Error getting documents')
  }
})

app.get('/test-post', async (req, res) => {
  // データの登録処理
  const data = {
    name: 'test',
    age: 21,
  }
  try {
    await dbOperations.postCollectionData('test', data)
    res.send('test-post')
  } catch (error) {
    res.status(500).send('Error adding document')
  }
})

// サーバーの起動
app.listen(3000, () => {
  console.log('Server started on port 3000')
})
