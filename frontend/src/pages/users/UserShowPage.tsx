import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import * as userAPI from '../../apis/user.api'

const UserShowPage = (): JSX.Element => {
  const location = useLocation()
  const id = location.pathname.split('/users/')[1]

  const [user, setUser] = useState<User | null>()

  async function getUser() {
    const token = localStorage.getItem('@token')
    if (!token) {
      console.log('None Token')
      return
    }

    const getData = await userAPI.show(id, token)
    const user = getData.data.data?.user

    setUser(user)
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
        </>
      )}
    </div>
  )
}

export default UserShowPage
