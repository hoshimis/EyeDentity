const video = document.querySelector('#video');
const movie = document.querySelector('#movie');
let mediaRecorder;

initVideoCamera();
document.querySelector('#recode-start').addEventListener('click', recodeStart);

/**
 * ビデオのカメラ設定(デバイスのカメラ映像をビデオに描画)
 */
function initVideoCamera() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment", aspectRatio: 3 / 4, width: { ideal: 720 }, height: { ideal: 960 }
        }, audio: false
    })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.addEventListener(
                'dataavailable',
                e => movie.src = URL.createObjectURL(e.data)
            );
        })
        .catch(e => console.log(e));
}
//eに動画urlが入ってそう

/**
 * 動画撮影の開始
 */
function recodeStart() {
    mediaRecorder.start();
    setTimeout(() => {
        mediaRecorder.stop();
        console.log("end")
    }, 6000);
}

document.querySelector('#recode-stop').addEventListener('click', recodeStop);