function CoppyButton() {
  var sourceElement = document.getElementById('FaceRegister')
  // Copy the value from source to clipboard
  sourceElement.select()
  document.execCommand('copy')
  alert('コピーしました！')
}
function cancelsubmit() {
  // フォームを送信
  const form = document.querySelector('form')
  const title = document.querySelector('#liveName')
  const date = document.querySelector('#datepicker')
  const eventTime = document.querySelector('#eventTime')
  const eventLocation = document.querySelector('#eventLocation')
  const eventDescription = document.querySelector('#eventDescription')
  const deadline = document.querySelector('#deadline')
  const deletePassword = document.querySelector('#deletePassword')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
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
        const newURL = `http://127.0.0.1:3000/api/v1/liveinfo/${id}`
        const textField = document.getElementById('FaceRegister')
        textField.value = newURL
      })
      .catch((error) => console.log(error))
  })
  return false
}
