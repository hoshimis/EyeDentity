const admin = require('firebase-admin')
const serviceAccount = require('./../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://eyedentity-af8b1.firebaseio.com',
  storageBucket: 'eyedentity-af8b1.appspot.com',
})

module.exports = admin
