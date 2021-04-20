import React, { useCallback, useEffect, useState } from 'react'
import { create } from '../apis/user.api'

import { createContextType } from './Common'
import firebase from '../libs/firebase'

/***************************
 *   Types
 **************************/
type AuthContextType = {
  user: User | null
  loading: boolean
  refreshToken: () => Promise<void>
  signin: () => Promise<void>
  signout: () => Promise<void>
}

/***************************
 *   CreateContext
 **************************/
const [useAuth, SetAuthProvider] = createContextType<AuthContextType>()

const AuthProvider: React.FC = ({ children }) => {
  const val = useAuthCtx()

  return <SetAuthProvider value={val}>{children}</SetAuthProvider>
}

/***************************
 *   Main
 **************************/
const useAuthCtx = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Tokenを更新する。
   */
  const refreshToken = async () => {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) {
      console.log('None CurrentUser')
      return
    }

    const token = await currentUser.getIdToken()
    console.log(token)
    if (!token) {
      console.log('None Token')
      return
    }

    localStorage.setItem('@token', token)
  }

  /**
   * GoogleAuth SignIn
   */
  const signin = useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (data) => {
        if (data.user) {
          if (data.user.displayName && data.user.photoURL) {
            const user: User = {
              id: data.user.uid,
              displayName: data.user.displayName,
              photoURL: data.user.photoURL,
            }

            await create(user)

            const currentUser = firebase.auth().currentUser
            if (!currentUser) throw new Error()

            const token = await currentUser.getIdToken()
            if (token) {
              localStorage.setItem('@token', token)
            }
          }
        }
      })
      .catch((e) => {
        setUser(null)
        if (e.code === 'auth/popup-closed-by-user') {
          return
        }
      })
  }, [])

  /**
   * GoogleAuth SignOut
   */
  const signout = useCallback(async () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null)
        localStorage.removeItem('@token')
      })
  }, [])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      setLoading(true)

      if (user) {
        const token = await user.getIdToken()

        localStorage.setItem('@token', token)

        if (user.displayName && user.photoURL) {
          const userData: User = {
            id: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
          setUser(userData)
        }
      } else {
        setUser(null)
        localStorage.removeItem('@token')
      }
      setLoading(false)
    })
  }, [])

  return { user, loading, refreshToken, signin, signout }
}

export { useAuth, AuthProvider }
