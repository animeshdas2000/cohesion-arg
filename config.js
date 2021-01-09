const dotenv = require ('dotenv');
dotenv.config ();
const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
} = process.env;

module.exports = {
    firebaseConfig : {
        apiKey:apiKey,
        authDomain:authDomain,
        projectId:projectId,
        storageBucket:storageBucket,
        messagingSenderId:messagingSenderId,
        appId:appId
    }
}