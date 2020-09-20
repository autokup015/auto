import config from './config'
import firebase from 'firebase'

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

const auth = firebase.auth()
const database = firebase.database()
const storage = firebase.storage()

export { auth, database, storage }