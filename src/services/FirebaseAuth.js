import { sendEmailVerification, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./FirebaseConfig";

class FirebaseAuth {
  static async sendVerificationEmail() {
    await sendEmailVerification(this.getUser())
  }

  static getUser() {
    auth.onAuthStateChanged(user => {
      return user
    });
  }


  static async isVerified() {
  await auth.currentUser.reload();
  return auth.currentUser.emailVerified
  }

  static async register(email, password) {
  let message = {code: null, message:null}
  await createUserWithEmailAndPassword(auth, email, password)
  .then(() => {
      message = {code:0, message:"success"};
  })
  .catch(error => {
    message = {code:1, message: error.code}
  })
  return message;
  }

  static async signOut () {
  await signOut(_auth)
  .then(() => console.log('User signed out!'));
  }

  static async signIn(email, password) {
    let message = {code: null, message:null}
      await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        message = {code:0, message:"success"};
    })
    .catch(error => {
      message = {code:1, message: error.code}
    })
    return message;
  }
}


export default FirebaseAuth