import { Link } from 'react-router-dom'

export const AAA = () => {
  return (
    <div>
      <h1>AAA!!!</h1>
      <a href="/bbb">BBB</a>
      <Link to={'/bbb'}>q</Link>
      <form method="post" action="http://localhost:4000/user">
        <button type="submit">a</button>
      </form>
    </div>
  )
}
