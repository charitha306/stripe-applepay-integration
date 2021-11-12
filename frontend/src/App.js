import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Pay from './Pay';
import ClientEdit from "./ClientEdit";

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/pay' exact={true} component={Pay}/>
            {/*<Route path='/clients/:id' component={ClientEdit}/>*/}
          </Switch>
        </Router>
    )
  }
}

export default App;
