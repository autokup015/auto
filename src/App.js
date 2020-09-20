import React, { Component } from 'react';
import { Route, Router, browserHistory, IndexRoute } from 'react-router';

import './App.css';
import SignUp from './screen/SignUp';
import Home from './screen/home';
import ShopProfile from './componemt/shopprofile';
import EditProfile from './componemt/editprofile';
import Details from './componemt/details';
import PrintQR from './componemt/printqr'
import Report from './componemt/report';
import QrScan from './componemt/scanner';
import UserReport from './componemt/userreport';

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <IndexRoute component={SignUp} />
        <Route path={'/'} component={SignUp} />
        <Route path={'/home'} component={Home} />
        <Route path={'/shopprofile'} component={ShopProfile} />
        <Route path={'/editprofile'} component={EditProfile} />
        <Route path={'/promotiondetail/:id'} component={Details} />
        <Route path={'/printqr/:id'} component={PrintQR} />
        <Route path={'/report/:id'} component={Report} />
        <Route path={'/userreport/:pid/:id'} component={UserReport} />
      </Router>
    );
  }
}

export default App;

