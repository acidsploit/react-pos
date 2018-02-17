import React, { Component } from 'react';
// import logo from './logo.svg';
import {Navbar, Icon} from 'react-materialize'
import './App.css';

import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import Order from "./Order";
import Payment from "./Payment";
import Ledger from "./Ledger";
import Settings from "./Settings";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Navbar left brand="React PoS" className="blue lighten-1">
            <li><NavLink to="/"><Icon left>home</Icon>HOME</NavLink></li>
            <li><NavLink to="/order"><Icon left>shopping_cart</Icon>ORDER</NavLink></li>
            <li><NavLink to="/payment"><Icon left>payment</Icon>PAYMENT</NavLink></li>
            <li><NavLink to="/ledger"><Icon left>list</Icon>LEDGER</NavLink></li>
            <li><NavLink to="/settings"><Icon left>settings</Icon>SETTINGS</NavLink></li>
          </Navbar>
          
          <Route exact path="/" component={Home}/>
          <Route path="/order" component={Order}/>
          <Route path="/payment" component={Payment}/>
          <Route path="/ledger" component={Ledger}/>
          <Route path="/settings" component={Settings}/>
          
        </div>
      </HashRouter>
    );
  }
}

export default App;
