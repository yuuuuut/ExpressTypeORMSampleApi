import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

import * as messageAPI from '../../apis/message.api'
import * as roomAPI from '../../apis/room.api'
import { useAuth } from '../../contexts/AuthContext'

const RoomShowPage = (): JSX.Element => {
  const { user } = useAuth()
  const location = useLocation()
  const id = location.pathname.split('/rooms/')[1]

  const history = useHistory()

  const [room, setRoom] = useState<Room | null>()
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

  const updateMessageIsApproval = async (messageId: number) => {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    const response = await messageAPI.update(messageId, 'IS_APPROVAL', token)
    console.log(response)
    if (!response.data.data) {
      return
    }
    history.go(0)
  }

  const updateMessageRejected = async (messageId: number) => {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    const response = await messageAPI.update(messageId, 'REJECTED', token)
    console.log(response)
    if (!response.data.data) {
      return
    }
    history.go(0)
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
                  {m.kind === 'LINE' && (
                    <div>
                      {!m.rejected ? (
                        <div>
                          {m.isApproval ? (
                            <h3>LINE ID 表示</h3>
                          ) : (
                            <>
                              {m.user.id !== user?.id ? (
                                <>
                                  <h3>LINE ID の交換を許可しますか??</h3>
                                  <div
                                    onClick={() =>
                                      updateMessageIsApproval(m.id)
                                    }
                                  >
                                    交換しましょう!!
                                  </div>
                                  <div
                                    onClick={() => updateMessageRejected(m.id)}
                                  >
                                    ごめんなさい...
                                  </div>
                                </>
                              ) : (
                                <h3>LINE IDを送りました。</h3>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <h3>交換は承認されませんでした...</h3>
                      )}
                    </div>
                  )}
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
