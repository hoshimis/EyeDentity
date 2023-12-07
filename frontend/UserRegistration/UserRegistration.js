const live = document.querySelector('.live')
const title = live.querySelector('.live__title')
const date = live.querySelector('.live__date')
const place = live.querySelector('.live__place')
const description = live.querySelector('.live__description')

fetch('http://127.0.0.1:3000/api/v1/liveinfo/1f6351d8b7')
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
    place.textContent = liveInfo.place
    description.textContent = liveInfo.description
  })
  .catch((error) => console.error(error))

// フォームを送信 ↓ まだ API は作っていないのでエラーになる
const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = document.querySelector('#name').value
  const email = document.querySelector('#email').value
  const data = {
    name: name,
    email: email,
  }
  fetch('http://127.0.0.1:3000/api/v1/user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error))
})
