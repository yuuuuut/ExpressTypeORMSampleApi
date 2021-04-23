import { Route, Switch } from 'react-router-dom'

import { AAA } from './components/AAA'
import { BBB } from './components/BBB'
import Root from './pages/Root'
import UserShowPage from './pages/users/UserShowPage'

const Router = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/" component={Root} />

      <Route exact path="/users/:id" component={UserShowPage} />
      <Route exact path="/aaa" component={AAA} />
      <Route exact path="/bbb" component={BBB} />
    </Switch>
  )
}

export default Router
