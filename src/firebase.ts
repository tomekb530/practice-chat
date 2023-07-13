import { initializeApp } from 'firebase/app'
import { getFirestore, onSnapshot, setDoc, getDoc, doc, getDocs, collection} from 'firebase/firestore'
import { getDatabase} from 'firebase/database'
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import config from './firebaseconfig'
export const firebaseApp = initializeApp(config)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
}

export const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const createUserWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const setDisplayName = (displayName: string) => {
 if(auth.currentUser){
    return updateProfile(auth.currentUser, {displayName: displayName})
  }
}

export const sendMessageData = (message: string, channel: number) => {
  if(auth.currentUser){
    return setDoc(doc(db, `channels/${channel}/messages`, Date.now().toString()), {
      message: message,
      user: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      timestamp: Date.now(),
      avatarUrl: auth.currentUser.photoURL || "https://avatars.dicebear.com/api/avataaars/1.svg"
    })
  }
}

export const getMessagesData = (channel: number) => {
  return getDocs(collection(db, `channels/${channel}/messages`))
}

export const getMessagesDataRealtime = (channel: number, callback: any) => {
  return onSnapshot(collection(db, `channels/${channel}/messages`), callback)
}

export const getAllChannels = () => {
  return getDocs(collection(db, `channels`))
}
//Promise<boolean>
export async function isAdmin(uid: string){
  if(uid == "") return false
  return getDoc(doc(db, `users/${uid}`)).then(
    (data) => {
      const info = data.data()
      return info?.isAdmin
    }
  )
}
//Promise<boolean>
export async function isBanned(uid: string){
  if(uid == "") return false
  return getDoc(doc(db, `users/${uid}`)).then(
    (data) => {
      const info = data.data()
      return info?.isBanned
    }
  )
}



export const getChannelSettings = (channel: number) => {
  return getDoc(doc(db, `channels/${channel}`))
}

export const signOut = () => {
  return auth.signOut()
}