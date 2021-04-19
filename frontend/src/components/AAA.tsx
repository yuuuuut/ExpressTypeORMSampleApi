import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const AAA = () => {
  const { user, signin, signout } = useAuth()

  const handleSignin = async () => {
    await signin()
  }

  const handleSignout = async () => {
    await signout()
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
      <form method="post" action="http://localhost:4000/user">
        <button type="submit">a</button>
      </form>
    </div>
  )
}
