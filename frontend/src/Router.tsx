import { Route, Switch } from 'react-router-dom'

import { AAA } from './components/AAA'
import { BBB } from './components/BBB'

const Router = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/aaa" component={AAA} />
      <Route exact path="/bbb" component={BBB} />
    </Switch>
  )
}

export default Router
