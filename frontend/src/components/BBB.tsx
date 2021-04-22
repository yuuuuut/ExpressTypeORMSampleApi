import axios from 'axios'
import { useEffect } from 'react'

export const BBB = () => {
  const a = async () => {
    const b = await axios.get('http://localhost:4000/api/users')

    return b
  }

  useEffect(() => {
    console.log('OK!')

    const res = a()

    console.log(res)
  }, [])

  return (
    <div>
      <h1 onClick={a}>BBB!!!</h1>
    </div>
  )
}
