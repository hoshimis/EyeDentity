const live = document.querySelector('.live')
const title = live.querySelector('.live__title')
const date = live.querySelector('.live__date')
const time = live.querySelector('.live__time')
const place = live.querySelector('.live__place')
const description = live.querySelector('.live__description')
const deadline = live.querySelector('.live__deadline')
const video = document.getElementById('video')

const sizeLimit = 1024 * 1024 * 10 // 制限サイズ

// changeイベントで呼び出す関数
const handleFileSelect = () => {
  const files = video.files
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > sizeLimit) {
      // ファイルサイズが制限以上
      alert('ファイルサイズは10MB以下にしてください') // エラーメッセージを表示
      video.value = '' // inputの中身をリセット
      return // この時点で処理を終了する
    }
  }
}

video.addEventListener('change', handleFileSelect)

// クエリパラメータから liveId を取得
const params = new URLSearchParams(window.location.search)
const liveId = params.get('liveId')

// 指定された liveId のライブ情報を取得
fetch('http://127.0.0.1:3000/api/v1/liveinfo/' + liveId)
  .then((response) => {
    if (!response.ok) {
      throw new Error('ネットワークの応答が正しくありませんでした')
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
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const name_kanji = document.querySelector('#name-kanji').value
  const name_hurigana = document.querySelector('#name-hurigana').value
  const address = document.querySelector('#address').value

  // FormDataオブジェクトを作成し、ユーザーの入力を追加
  const formData = new FormData()
  formData.append('kanji', name_kanji)
  formData.append('hurigana', name_hurigana)
  formData.append('address', address)
  formData.append('id', liveId)
  formData.append('uploadFile', video.files[0])

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/user/', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('ネットワークの応答が正しくありませんでした')
    }

    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
})
