import axios from 'axios'
import { Link } from 'react-router-dom'

export const AAA = (): JSX.Element => {
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
      <a href="/bbb">BBB</a>
      <Link to={'/bbb'}>q</Link>

      <button onClick={a}>Update</button>
    </div>
  )
}
