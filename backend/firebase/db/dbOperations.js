/**
 * データベース操作用モジュール
 *
 * このモジュールは、Firebase Firestoreデータベースへのデータの取得と登録を行うための関数を提供します。
 *
 * @module dbOperations
 */

const { db } = require('./db') // db.jsからデータベースをインポート

/**
 ** Firestore の Collection データを取得する関数
 * @async
 * @function
 * @param {string} collectionName - 取得先のコレクション名
 * @returns {Promise<Array>} 取得したデータの配列
 * @throws {Error} データの取得中にエラーが発生した場合
 */
async function getCollectionData(collectionName) {
  try {
    const getedData = []
    const snapshot = await db.collection(`${collectionName}`).get()
    snapshot.forEach((doc) => {
      getedData.push(doc.data())
    })
    return getedData
  } catch (error) {
    console.error('Error getting documents', error)
    throw error
  }
}

/**
 ** Firestore の Collection → Document 内のデータを取得する関数
 * @async
 * @function
 * @param {string} collectionName - 取得先のコレクション名
 * @param {string} documentName - 取得先のドキュメント名
 * @returns {Promise<object>} 取得したデータの配列
 * @throws {Error} データの取得中にエラーが発生した場合
 */
async function getDocumentData(collectionName, documentName) {
  try {
    const snapshot = await db
      .collection(`${collectionName}`)
      .doc(`${documentName}`)
      .get()

    if (!snapshot.exists) {
      console.log('No such document!')
      return null
    } else {
      console.log('Document data:', snapshot.data())
      const data = snapshot.data()
      return data
    }
  } catch (error) {
    console.error('Error getting documents', error)
    throw error
  }
}

/**
 ** Firestore の Collection にデータを登録する関数
 * @async
 * @function
 * @param {string} collectionName - 登録先のコレクション名
 * @param {object} data - 登録するデータ
 * @returns {Promise<object>} 登録されたデータに関する情報
 * @throws {Error} データの登録中にエラーが発生した場合
 */
async function addToCollection(collectionName, data) {
  try {
    const docRef = await db.collection(`${collectionName}`).add(data)
    console.log('Document written with ID:', docRef.id)
    return docRef
  } catch (error) {
    console.error('Error adding document:', error)
    throw error
  }
}

/**
 ** Firestore の Collection → Document にデータを登録する関数
 * コレクション、ドキュメントの指定ができる
 * @async
 * @function
 * @param {string} collectionName - 登録先のコレクション名
 * @param {string} documentName - 登録先のドキュメント名
 * @param {object} data - 登録するデータ
 * @returns {Promise<object>} 登録されたデータに関する情報
 * @throws {Error} データの登録中にエラーが発生した場合
 */
async function addToDocument(collectionName, documentName, data) {
  try {
    const docRef = await db
      .collection(`${collectionName}`)
      .doc(`${documentName}`)
      .set(data)

    console.log('Document written with ID:', docRef)
    return docRef
  } catch (error) {
    console.error('Error adding document:', error)
    throw error
  }
}

// 指定したコレクション内のドキュメントの編集
async function editDocument(collectionName, documentName, data) {
  try {
    const docRef = await db
      .collection(`${collectionName}`)
      .doc(`${documentName}`)
      .update(data)

    console.log('Document edited with ID:', docRef)
    return docRef
  } catch (error) {
    console.error('Error editing document:', error)
    throw error
  }
}

module.exports = {
  getCollectionData,
  getDocumentData,
  addToCollection,
  addToDocument,
  editDocument,
}
