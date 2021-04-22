import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const AAA = (): JSX.Element => {
  const { user, signin, signout } = useAuth()

  const handleSignin = async () => {
    await signin()
  }

  const handleSignout = async () => {
    await signout()
  }

  const a = async () => {
    const token = localStorage.getItem('@token')
    if (!token) console.log('None Token')

    const data = {
      lineId: 'A',
    }

    const res = await axios.put('http://localhost:4000/api/profiles', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(res)
  }

  return (
    <div>
      <h1>AAA!!!</h1>
      {user ? (
        <button onClick={handleSignout}>Logout</button>
      ) : (
        <button onClick={handleSignin}>Login</button>
      )}
      <a href="/bbb">BBB</a>
      <Link to={'/bbb'}>q</Link>

      <button onClick={a}>Update</button>
    </div>
  )
}
