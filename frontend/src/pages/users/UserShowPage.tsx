import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

import * as userAPI from '../../apis/user.api'
import * as roomAPI from '../../apis/room.api'

const UserShowPage = (): JSX.Element => {
  const location = useLocation()
  const history = useHistory()
  const id = location.pathname.split('/users/')[1]

  const [user, setUser] = useState<User | null>()

  async function getUser() {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    const response = await userAPI.show(id, token)
    console.log(response)
    const user = response.data.data?.user

    setUser(user)
  }

  async function createRoom(id: string) {
    try {
      const token = localStorage.getItem('@token')
      if (!token) {
        console.log('None Token')
        return
      }

      const response = await roomAPI.create(id, token)
      console.log(response.data.data?.room.id)
      const roomId = response.data.data?.room.id

      history.push(`/rooms/${roomId}`)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div>
      {user && (
        <>
          <div>{user.id}</div>
          <div>{user.displayName}</div>
          <button onClick={() => createRoom(user.id)}>Room Create</button>
        </>
      )}
    </div>
  )
}

export default UserShowPage
