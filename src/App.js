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
    constructor(props) {
    super(props);
    
    var shopName

    if (localStorage.getItem('name'))
      shopName = localStorage.getItem('name')
    else
      shopName = "PYXPUB.IO"
      localStorage.setItem('name', shopName)

    
    this.state = {  name: shopName,
                  };
  }
  
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Navbar left brand={this.state.name} className="light-blue darken-4 home-brand">
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
