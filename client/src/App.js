import React from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Todo from './components/Todo';
import Search from './components/Search';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Register /> */}
        <Switch>
          <Route exact path="/" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/todo" component={Todo} />
          <Route path="/search" component={Search} />
          {/* <Route path="/:filmIndex" component={Film} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
