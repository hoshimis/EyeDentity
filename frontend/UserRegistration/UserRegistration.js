const live = document.querySelector('.live')
const title = live.querySelector('.live__title')
const date = live.querySelector('.live__date')
const time = live.querySelector('.live__time')
const place = live.querySelector('.live__place')
const description = live.querySelector('.live__description')
const deadline = live.querySelector('.live__deadline')

// クエリパラメータから liveId を取得
const params = new URLSearchParams(window.location.search)
const liveId = params.get('liveId')

// 指定された liveId のライブ情報を取得
fetch('http://127.0.0.1:3000/api/v1/liveinfo/' + liveId)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((data) => {
    liveInfo = data
    // HTML に 得た情報を反映
    title.textContent = liveInfo.liveName
    date.textContent = liveInfo.date
    time.textContent = liveInfo.time
    place.textContent = liveInfo.place
    description.textContent = liveInfo.description
    deadline.textContent = liveInfo.deadline
  })
  .catch((error) => console.error(error))

const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name_kanji = document.querySelector('#name-kanji').value
  const name_hurigana = document.querySelector('#name-hurigana').value
  const requestBody = {
    kanji: name_kanji,
    hurigana: name_hurigana,
  }

  // TODO: ここはユーザを登録するところだが、顔を撮影した動画も一緒にアップロードする
  fetch('http://127.0.0.1:3000/api/v1/user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error))
})
