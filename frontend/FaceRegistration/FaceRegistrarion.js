const video = document.querySelector('#video');
const movie = document.querySelector('#movie');
let mediaRecorder;

initVideoCamera();
document.querySelector('#recode-start').addEventListener('click', recodeStart);
document.querySelector('#recode-stop').addEventListener('click', recodeStop);
document.querySelector('#kakunin').addEventListener('click', kakunin);
/**
 * ビデオのカメラ設定(デバイスのカメラ映像をビデオに描画)
 */
function initVideoCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.addEventListener(
                'dataavailable'
                , e => movie.src = URL.createObjectURL(e.data));
        })
        .catch(e => console.log(e));
        console.log(URL)
}
function kakunin() {
    console.log(movie.src)
}
/**
 * 動画撮影の開始
 */
function recodeStart() {
    mediaRecorder.start();
    document.querySelector('#recode-start').classList.add('hidd');
    document.querySelector('#recode-stop').classList.remove('hidd');
}
/**
 * 動画撮影の停止
 */
function recodeStop() {
    mediaRecorder.stop();
    document.querySelector('#recode-start').classList.remove('hidd');
    document.querySelector('#recode-stop').classList.add('hidd');
}