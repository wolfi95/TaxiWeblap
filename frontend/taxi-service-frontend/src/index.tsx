import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import LoginPage from './Pages/Login/LoginPage';
import store from './redux/store';
import { Provider } from 'react-redux';
import RegisterPage from './Pages/Register/RegisterPage';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
    <Router>
        <Switch>
        <Route exact path="/home" component={App}/>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>
        </Switch>
      </Router>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
