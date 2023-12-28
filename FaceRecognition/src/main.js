// Video タグ
const player = document.getElementById('player')

let src = null
let dst = null
let cap = null
let isCvLoaded = false

function onOpenCvReady() {
  // OpenCV.jsのロードが終わったら呼ばれる
  if (cv.getBuildInformation) {
    console.log(cv.getBuildInformation())
    onloadCallback()
  } else {
    // WASM
    cv['onRuntimeInitialized'] = () => {
      console.log(cv.getBuildInformation())
      onloadCallback()
    }
  }
}

function onloadCallback() {
  // OpenCV.jsのロード完了
  isCvLoaded = true
  console.log('OpenCV.js is ready.')
}

const constraints = {
  video: true,
}

// Attach the video stream to the video element and autoplay.
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  player.srcObject = stream
  player.addEventListener('canplay', onVideoCanPlay, false)
})

function onVideoCanPlay() {
  // ビデオ再生が可能になった
  player.width = player.videoWidth // width, heightを設定しないとcap.read(src)で失敗する。
  player.height = player.videoHeight
  setTimeout(processVideo, 100)
}

const FPS = 30
function processVideo() {
  try {
    if (!isCvLoaded) {
      setTimeout(processVideo, 100)
      return
    } else if (cap == null) {
      // OpenCVのロードが終わり、Videoのフレームがくるのを待つ
      cap = new cv.VideoCapture(player)
    }
    let begin = Date.now()

    // start processing.
    src = new cv.Mat(player.height, player.width, cv.CV_8UC4)
    dst = new cv.Mat()
    cap.read(src)
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)
    cv.imshow('canvasOutput', dst)
    src.delete()
    dst.delete()

    // schedule the next one.
    let delay = 1000 / FPS - (Date.now() - begin)
    setTimeout(processVideo, delay)
  } catch (err) {
    console.error(err.message)
  }
  return
}
