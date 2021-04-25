import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import * as messageAPI from '../../apis/message.api'
import * as roomAPI from '../../apis/room.api'

const RoomShowPage = (): JSX.Element => {
  const location = useLocation()
  const id = location.pathname.split('/rooms/')[1]

  const [room, setRoom] = useState<Room | null>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<Message[]>([])

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

  async function getMessages() {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    const response = await messageAPI.index(id, token)
    console.log(response)

    if (!response.data.data) {
      return
    }

    const messages = response.data.data.messages
    setMessages(messages)
  }

  const createMessage = async () => {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    const response = await messageAPI.create(id, 'LINE', token)

    console.log(response)
  }

  useEffect(() => {
    getRoom()
    getMessages()
  }, [])

  return (
    <div>
      {room ? (
        <div>
          {room.id}
          <button onClick={() => createMessage()}>Create Message</button>
          {messages !== [] && (
            <div>
              {messages.map((m) => (
                <li key={m.id}>
                  <div>{m.kind}</div>
                  <div>{m.user.id}</div>
                </li>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>Not Room</div>
      )}
    </div>
  )
}

export default RoomShowPage
