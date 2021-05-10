import firebaseAdmin from 'firebase-admin'

const credentials:
  | string
  | firebaseAdmin.ServiceAccount = require('../../credential.json')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(credentials),
})

export default firebaseAdmin
