import axios from 'axios'
import { useEffect } from 'react'

export const BBB = () => {
  const a = async () => {
    const b = await axios.get('http://localhost:4000/api/users')

    console.log(b)
  }

  useEffect(() => {
    console.log('OK!')
  }, [])

  return (
    <div>
      <h1 onClick={a}>BBB!!!</h1>
    </div>
  )
}
