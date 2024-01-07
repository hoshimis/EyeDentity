const button = document.querySelector('#button')

button.addEventListener('click', () => {
  const liveId = document.querySelector('#liveId').value
  // LiveIdをローカルストレージに保存
  localStorage.setItem('liveId', liveId)
  // 自身のUUIDを生成 & ローカルストレージに保存
  const uuid = generateUUID()
  localStorage.setItem('uuid', uuid)
  // recognition pageに遷移
  location.href = '/recognition'
})

// 単純なUUID生成関数
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
