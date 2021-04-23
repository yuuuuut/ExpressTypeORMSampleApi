import { useEffect, useState } from 'react'
import * as userAPI from '../apis/user.api'
import * as relatinoshipAPI from '../apis/relationship.api'
import { useAuth } from '../contexts/AuthContext'

const Root = (): JSX.Element => {
  const { user, signin, signout } = useAuth()

  const handleSignin = async () => {
    await signin()
  }

  const handleSignout = async () => {
    await signout()
  }

  const [users, setUsers] = useState<User[]>([])
  const [load, setLoad] = useState(false)

  async function getUsers() {
    setLoad(true)
    const response = await userAPI.index()

    if (!response.data.data) {
      return
    }
    const usersData = response.data.data.users

    setUsers(usersData)
    setLoad(false)
  }

  async function follow(userId: string) {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    console.log(token)

    const response = await relatinoshipAPI.create(userId, token)

    console.log(response)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div>
      <h1>Root Page</h1>
      {user ? (
        <button onClick={handleSignout}>Logout</button>
      ) : (
        <button onClick={handleSignin}>Login</button>
      )}

      {load ? (
        <div>Loading...</div>
      ) : (
        <>
          {users && (
            <>
              {users.map((user) => (
                <li key={user.id}>
                  <div>ID:{user.id}</div>
                  <div> Name:{user.displayName}</div>
                  <button onClick={() => follow(user.id)}>Follow</button>
                </li>
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Root
