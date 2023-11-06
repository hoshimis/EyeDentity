const admin = require('./../index')
const storage = admin.storage()
const bucket = storage.bucket()

module.exports = {
  bucket,
}
