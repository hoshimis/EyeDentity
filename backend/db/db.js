/**
 * Firebase Firestoreデータベースを初期化し、異なるコレクションへの参照を提供する.
 *
 * @module db/db
 */

const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')

// Firebase Firestoreの初期化
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

/**
 * 'test' コレクションへの参照を提供
 * @type {object}
 */
const testDb = db.collection('test')

/**
 * 'liveInfo' コレクションへの参照を提供
 * @type {object}
 */
const liveInfoDb = db.collection('liveInfo')

/**
 * 'user' コレクションへの参照を提供
 * @type {object}
 */
const userDb = db.collection('user')

module.exports = {
  db,
  testDb,
  liveInfoDb,
  userDb,
}
