import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from '@skyway-sdk/room'

import env from 'dotenv'
env.config()

// OpenCV.jsの読み込み
function onOpenCvReady() {
  cv['onRuntimeInitialized'] = () => {
    console.log('OpenCV.js is ready')
  }
}

const token = new SkyWayAuthToken({
  jti: uuidV4(),
  iat: nowInSec(),
  exp: nowInSec() + 60 * 60 * 24,
  scope: {
    app: {
      id: process.env.APP_ID,
      turn: true,
      actions: ['read'],
      channels: [
        {
          id: '*',
          name: '*',
          actions: ['write'],
          members: [
            {
              id: '*',
              name: '*',
              actions: ['write'],
              publication: {
                actions: ['write'],
              },
              subscription: {
                actions: ['write'],
              },
            },
          ],
          sfuBots: [
            {
              actions: ['write'],
              forwardings: [
                {
                  actions: ['write'],
                },
              ],
            },
          ],
        },
      ],
    },
  },
}).encode(process.env.SKYWAY_SECRET_KEY)

// OpenCVを使用した顔認識を追加
const detectFaces = (video, context) => {
  const cap = new cv.VideoCapture(video)

  const detectAndDraw = () => {
    const frame = new cv.Mat()
    cap.read(frame)

    // ここで顔認識を実行
    // 例：事前にトレーニングされたモデルを使用して顔を検出
    const faceCascade = new cv.CascadeClassifier()
    faceCascade.load('haarcascade_frontalface_default.xml') // haarcascade_frontalface_default.xml ファイルをダウンロードしてプロジェクトにホストする必要があります

    const faces = new cv.RectVector()
    const gray = new cv.Mat()
    cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY)
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0)

    // 顔の周りに四角形を描画
    for (let i = 0; i < faces.size(); ++i) {
      const faceRect = faces.get(i)
      const point1 = new cv.Point(faceRect.x, faceRect.y)
      const point2 = new cv.Point(
        faceRect.x + faceRect.width,
        faceRect.y + faceRect.height
      )
      cv.rectangle(frame, point1, point2, [255, 0, 0, 255])
    }

    // 処理されたフレームを表示
    cv.imshow('local-video', frame)

    // リソースを解放
    frame.delete()
    gray.delete()
    faces.delete()
    requestAnimationFrame(detectAndDraw)
  }

  detectAndDraw()
}

;(async () => {
  cv['onRuntimeInitialized'] = () => {
    console.log('OpenCV.js is ready')
  }
  const localVideo = document.getElementById('local-video')
  const buttonArea = document.getElementById('button-area')
  const remoteMediaArea = document.getElementById('remote-media-area')
  const roomNameInput = document.getElementById('room-name')

  const myId = document.getElementById('my-id')
  const joinButton = document.getElementById('join')

  const { audio, video } =
    await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream()
  video.attach(localVideo)
  detectFaces(localVideo)
  await localVideo.play()

  joinButton.onclick = async () => {
    if (roomNameInput.value === '') return

    const context = await SkyWayContext.Create(token)
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: roomNameInput.value,
    })
    const me = await room.join()

    myId.textContent = me.id

    await me.publish(audio)
    await me.publish(video)

    const subscribeAndAttach = (publication) => {
      if (publication.publisher.id === me.id) return

      const subscribeButton = document.createElement('button')
      subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`
      buttonArea.appendChild(subscribeButton)

      subscribeButton.onclick = async () => {
        const { stream } = await me.subscribe(publication.id)

        let newMedia
        switch (stream.track.kind) {
          case 'video':
            newMedia = document.createElement('video')
            newMedia.playsInline = true
            newMedia.autoplay = true
            break
          case 'audio':
            newMedia = document.createElement('audio')
            newMedia.controls = true
            newMedia.autoplay = true
            break
          default:
            return
        }
        stream.attach(newMedia)
        remoteMediaArea.appendChild(newMedia)
      }
    }

    room.publications.forEach(subscribeAndAttach)
    room.onStreamPublished.add((e) => subscribeAndAttach(e.publication))
  }
})()
