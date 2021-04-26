import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

import * as userAPI from '../../apis/user.api'
import * as roomAPI from '../../apis/room.api'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

const UserShowPage = (): JSX.Element => {
  const { user } = useAuth()

  const location = useLocation()
  const history = useHistory()
  const id = location.pathname.split('/users/')[1]

  const [u, setU] = useState<User | null>()
  const [isMutualFollow, setIsMutualFollow] = useState(false)
  const [isRoom, setIsRoom] = useState(false)
  const [roomId, setRoomId] = useState('')

  async function getUser() {
    const token = localStorage.getItem('@token')
    if (!token) return

    const response = await userAPI.show(id, token)
    if (!response.data.data) return

    console.log(response)

    const u = response.data.data.user
    setU(u)

    if (response.data.data.user.id !== user?.id) {
      const isMutualFollow = response.data.data.isMutualFollow,
        isRoom = response.data.data.isRoom,
        roomId = response.data.data.roomId
      setIsMutualFollow(isMutualFollow)
      setIsRoom(isRoom)
      setRoomId(roomId)

      console.log('OK')
      console.log(isMutualFollow)
      console.log(isRoom)
    }
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
      {u && (
        <>
          <div>{u.id}</div>
          <div>{u.displayName}</div>
          {isMutualFollow && (
            <div>
              {isRoom ? (
                <Link to={`/rooms/${roomId}`}>Roomへ</Link>
              ) : (
                <button onClick={() => createRoom(u.id)}>Room Create</button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserShowPage
