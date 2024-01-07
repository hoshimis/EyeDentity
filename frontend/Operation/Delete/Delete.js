const searchButton = document.querySelector('#search-button')
const inputUrl = document.querySelector('#url')
const inputPass = document.querySelector('#password')

class ResonseError extends Error {
  constructor(message, response) {
    super(message)
    this.response = response
  }
}

const submitButton = async () => {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        liveId: inputUrl.value,
        pass: inputPass.value,
      }),
    })

    if (!response.ok) {
      throw new ResonseError('Network response was not ok', response)
    } else {
      const html = await response.text()// Get the rendered HTML from express
      document.write(html)
    }
  } catch (error) {
    switch (error.response.status) {
      case 500:
        alert('パスワードまたはURLが間違っています')
        break
    }
  }
}

searchButton.addEventListener('click', submitButton)
