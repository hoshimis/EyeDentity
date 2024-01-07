const form = document.querySelector('form')
const title = document.querySelector('#liveName')
const date = document.querySelector('#datepicker')
const eventTime = document.querySelector('#eventTime')
const eventLocation = document.querySelector('#eventLocation')
const eventDescription = document.querySelector('#eventDescription')
const deadline = document.querySelector('#deadline')
const deletePassword = document.querySelector('#deletePassword')
const submitButton = document.querySelector('.create-button')
const loading = document.querySelector('#loading')
const sourceElement = document.getElementById('FaceRegister')

const CoppyButton = () => {
  // Copy the value from source to clipboard
  sourceElement.select()
  document.execCommand('copy')
  alert('ライブ情報の登録が完了しました！')
  alert('ユーザ配布用のURLをクリップボードにコピーしました！')

  // roadingを非表示
  loading.classList.remove('loading--active')
  loading.style.display = 'none'
}

// setIntervalを使う方法
const sleep = (waitSec, callbackFunc) => {
  // 経過時間（秒）
  var spanedSec = 0

  // 1秒間隔で無名関数を実行
  var id = setInterval(function () {
    spanedSec++

    // 経過時間 >= 待機時間の場合、待機終了。
    if (spanedSec >= waitSec) {
      // タイマー停止
      clearInterval(id)

      // 完了時、コールバック関数を実行
      if (callbackFunc) callbackFunc()
    }
  }, 1000)
}

const validateForm = () => {
  const titleValue = title.value.trim()
  const dateValue = date.value.trim()
  const eventTimeValue = eventTime.value.trim()
  const eventLocationValue = eventLocation.value.trim()
  const eventDescriptionValue = eventDescription.value.trim()
  const deadlineValue = deadline.value.trim()
  const deletePasswordValue = deletePassword.value.trim()

  if (
    titleValue === '' ||
    dateValue === '' ||
    eventTimeValue === '' ||
    eventLocationValue === '' ||
    eventDescriptionValue === '' ||
    deadlineValue === '' ||
    deletePasswordValue === ''
  ) {
    return false
  }

  return true
}

const fetchCreateAPI = () => {
  if (validateForm()) {
    console.log('バリデーションOK')
  } else {
    console.log('バリデーションNG')
    return false
  }
  // roadingを表示
  loading.style.display = 'flex'
  loading.classList.add('loading--active')

  const requestBody = {
    liveName: title.value,
    date: date.value,
    time: eventTime.value,
    place: eventLocation.value,
    description: eventDescription.value,
    deadline: deadline.value,
    deletePassword: deletePassword.value,
  }

  fetch('http://127.0.0.1:3000/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      const id = data.liveId
      // TODO: ここでURLを本番用に変更する
      const newURL = `http://127.0.0.1:5500/frontend/UserRegistration/UserRegistration.html?liveId=${id}`
      const textField = document.getElementById('FaceRegister')
      textField.value = newURL

      sleep(3, function () {
        CoppyButton()
      })
    })
    .catch((error) => console.log(error))
}

submitButton.addEventListener('click', fetchCreateAPI)
