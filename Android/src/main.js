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
const detectFaces = (videoElement, context) => {
  const cap = new cv.VideoCapture(videoElement)

  if (!cap.isOpened) {
    console.error('Error opening video stream or file.')
    return
  }

  const detectAndDraw = async () => {
    const frame = new cv.Mat()
    cap.read(frame)

    // 顔認識
    const faceCascade = new cv.CascadeClassifier()
    faceCascade.load('haarcascade_frontalface_default.xml')

    const faces = new cv.RectVector()
    const gray = new cv.Mat()

    cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY)
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0)

    for (let i = 0; i < faces.size(); ++i) {
      const face = faces.get(i)
      const point1 = new cv.Point(face.x, face.y)
      const point2 = new cv.Point(face.x + face.width, face.y + face.height)
      cv.rectangle(frame, point1, point2, [255, 0, 0, 255])
    }

    // 処理された画像を表示
    cv.imshow('local-video', frame)

    // リソースの解放
    frame.delete()
    gray.delete()
    faces.delete()
    requestAnimationFrame(detectAndDraw)
  }

  detectAndDraw()
}

// OpenCV.jsの読み込み
function onOpenCvReady() {
  console.log('OpenCV.js is ready')

  if (
    !cv ||
    !cv.VideoCapture ||
    !cv.Mat ||
    !cv.MatVector ||
    !cv.RectVector ||
    !cv.Point
  ) {
    console.error('OpenCV.js is not ready')
    return
  }

  if (cv.getBuildInformation) {
    console.log(cv.getBuildInformation())
    onloadCallback()
  } else {
    // WASMの場合はcv.onRuntimeInitializedが呼ばれたらOpenCV.jsが使用可能
    cv['onRuntimeInitialized'] = () => {
      console.log(cv.getBuildInformation())
      onloadCallback()
    }
  }

  const localVideo2 = document.getElementById('local-video2')

  // detectFacesを呼び出す
  detectFaces(localVideo2)
}

// OpenCV.jsの読み込みが完了したかどうか
const onloadCallback = () => {
  isCvLoaded = true
}

// 即時関数外で行わないと、onOpenCvReadyが定義されていないというエラーが出る
cv['onRuntimeInitialized'] = () => {
  onOpenCvReady()
}

const processVideo = () => {
  const FPS = 30

  try {
    if (!isCvLoaded) {
      console.log('OpenCV.js is not loaded')
      return
    } else if (cap == null) {
      // OpenCV.jsの読み込みが完了している場合は、capを初期化する
      cap = new cv.VideoCapture(localVideo2.srcObject)
    }

    let begin = Date.now()

    // capからフレームを取得
    src = new cv.Mat(localVideo2.height, localVideo2.width, cv.CV_8UC4)
    dst = new cv.Mat()

    cap.read(src)
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)
    cv.imshow('canvasOutput', dst)
    src.delete()
    dst.delete()

    // FPSを計算
    let delay = 1000 / FPS - (Date.now() - begin)
    setTimeout(processVideo, delay)
  } catch (err) {
    console.log(err)
  }
  return
}

// 即時関数 (OpenCV.jsの読み込みが完了するまで待つ)
;(async () => {
  // 各種DOM要素を取得
  const localVideo = document.getElementById('local-video')
  const buttonArea = document.getElementById('button-area')
  const remoteMediaArea = document.getElementById('remote-media-area')
  const roomNameInput = document.getElementById('room-name')
  const myId = document.getElementById('my-id')
  const joinButton = document.getElementById('join')

  // TODO: カメラとマイクの取得を2つの方法で行っている
  // TODO: 得たストリームをOpenCVで処理したいが、うまくいかない

  //! マイクとカメラ映像を取得して表示する (SkyWayStreamFactoryを使用)
  const { audio, video } =
    await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream()
  video.attach(localVideo)
  await localVideo.play()

  //! マイクとカメラ映像を取得して表示する (getUserMediaを使用)
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })

  const localVideo2 = document.getElementById('local-video2')
  localVideo2.srcObject = stream
  await localVideo2.play()

  // Joinボタンが押されたらルームに入る
  joinButton.onclick = async () => {
    if (roomNameInput.value === '') return

    const context = await SkyWayContext.Create(token)
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: roomNameInput.value,
    })
    const me = await room.join()

    myId.textContent = me.id

    // await me.publish(audio)
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
