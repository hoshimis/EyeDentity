const webcam = document.querySelector('#webcam')
const sendButton = document.querySelector('#sendButton')
const chatInput = document.querySelector('#chatInput')
const outputCanvas = document.querySelector('#outputCanvas')
const ctx = outputCanvas.getContext('2d')
// ローカルストレージから値を取得する
const liveId = localStorage.getItem('liveId')

// WebSocketオブジェクトを作成
const socket = io('ws://localhost:8088')

// 画面ロード時に実行される関数
window.onload = () => {
  join(liveId)
}

// ボタンを押したときに実行される関数
sendButton.onclick = () => {
  // userとmsgを送信
  const message = { msg: chatInput.value, user: localStorage.getItem('uuid') }
  send_room(liveId, message)
  // 送信したら入力欄を空にする
  chatInput.value = ''
}

// ルームに参加するための関数
const join = (room) => {
  socket.emit('join', { room: room })
}

// cb関数：send_roomを呼ぶ関数
const send_room = (room, chat_info) => {
  socket.emit('send_room', { chat_info: chat_info, to: room })
}

//サーバからルームへデータが送られてきたときのコールバック関数
//ここをアプリケーション仕様に合わせて改修すれば、リッチなアプリになる
socket.on('from_room', (data) => {
  //例1：取得したメッセージをHTMLに表示する。
  const messageArea = document.querySelector('#messages')
  const message = document.createElement('p')
  if (data.user === localStorage.getItem('uuid')) {
    message.className = 'message_mine_flame'
  } else {
    message.className = 'message_others_flame'
  }
  message.innerHTML = data.msg
  messageArea.appendChild(message)
})

// Webカメラのストリームを取得
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    webcam.srcObject = stream

    // サーバとのコネクション確立
    socket.on('connect', () => {
      socket.emit('server_echo', { data: 'Hello server from client' })
    })

    // フレームごとに処理
    webcam.addEventListener('loadeddata', () => {
      setInterval(() => {
        // キャンバスに映像を描画
        // 画像サイズを小さくすることで通信量を抑える (1/2に縮小)
        ctx.drawImage(
          webcam,
          0,
          0,
          outputCanvas.width / 2,
          outputCanvas.height / 2
        )

        // キャンバスの画像をBase64に変換
        const imageData = outputCanvas.toDataURL('image/jpeg')

        // 画像データをサーバーサイドに送信
        socket.emit('image', imageData)
      }, 1000 / 20) // 20fps
    })
  })
  .catch((error) => {
    console.error('Webcam access denied:', error)
  })

// サーバからのレスポンスを受け取ったときの処理
socket.on('result_image', (data) => {
  const img = new Image()
  img.src = data
  const responseCanvas = document.getElementById('responseCanvas')
  const ctx = responseCanvas.getContext('2d')
  // 上で縮小したので、ここで元のサイズに戻す
  ctx.drawImage(img, 0, 0, responseCanvas.width * 2, responseCanvas.height * 2)
})

// サーバとのコネクション切断
socket.on('disconnect', () => {
  console.log('Disconnected from server')
})
