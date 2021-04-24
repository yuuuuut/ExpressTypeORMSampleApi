import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import * as roomAPI from '../../apis/room.api'

const RoomShowPage = (): JSX.Element => {
  const location = useLocation()
  const id = location.pathname.split('/rooms/')[1]

  const [room, setRoom] = useState<Room | null>()

  async function getRoom() {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    const response = await roomAPI.show(id, token)
    console.log(response)
    const room = response.data.data?.room
    setRoom(room)
  }

  useEffect(() => {
    getRoom()
  }, [])

  return <div>{room ? <div>{room.id}</div> : <div>Not Room</div>}</div>
}

export default RoomShowPage
