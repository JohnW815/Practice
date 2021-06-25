import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCK3KYoVTHaQecaCcUewQhaJprWHGHm21Y",
  authDomain: "my-mini-blog-530c9.firebaseapp.com",
  projectId: "my-mini-blog-530c9",
  storageBucket: "my-mini-blog-530c9.appspot.com",
  messagingSenderId: "144694176423",
  appId: "1:144694176423:web:88782200db88e174be0982"
};

firebase.initializeApp(firebaseConfig)

firebase.firestore()

export default firebase