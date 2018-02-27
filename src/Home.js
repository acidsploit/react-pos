import React, { Component } from "react";
import {CardPanel, Container, Row, Col, Button} from 'react-materialize'

import {
  NavLink,
  HashRouter
} from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    
    var server
    if (localStorage.getItem('server'))
      server = localStorage.getItem('server')
    else
      server = "https://demo.pyxpub.io"
      localStorage.setItem('server', server)
    
    this.state = {  name: "DEFAULT",
                    server: server,
                  };
  }
  
  componentWillMount() {
    var shopName = localStorage.getItem('name');
    var server = localStorage.getItem('server');
    
    //console.log(shopName, server)
    
    this.setState({  name: shopName,
                    server: server,
                  })
  }
  
  
  render() {
    let greeting = null
    if (this.state.name && this.state.server){
      greeting =  <h4>Welcome to {this.state.name}!</h4>
    } else {
      greeting = (
        <Row>
          <Col s={12} l={6} className="offset-l3">
            <CardPanel className="red white-text">
              <span>
                <h4>Configure PoS! </h4>
                <span>Go to 'settings' and click 'save'</span><br /><br />
                <NavLink to="/settings"><Button large waves='light' className="blue lighten-1" icon="settings"/></NavLink>
              </span>
            </CardPanel>
          </Col>
        </Row>
        )
    }
    
    return (
      <HashRouter>
        <Container>
         <br />{greeting}<br />
          <CardPanel className="grey lighten-3 grey-text">
            <Row>
              <Col s={12} className='grid-index'><h4>Choose your action:</h4></Col>
            </Row>
            <Row>
              <Col s={3} className='grid-index'><NavLink to="/order"><Button large waves='light' icon="shopping_cart" className="blue lighten-1"/></NavLink></Col>
              <Col s={3} className='grid-index'><NavLink to="/payment"><Button large waves='light' icon="payment" className="blue lighten-1"/></NavLink></Col>
              <Col s={3} className='grid-index'><NavLink to="/ledger"><Button large waves='light' icon="list" className="blue lighten-1"/></NavLink></Col>
              <Col s={3} className='grid-index'><NavLink to="/settings"><Button large waves='light' icon="settings" className="blue lighten-1"/></NavLink></Col>
            </Row>
          </CardPanel>
          <b>Connected to server: </b>{this.state.server}
        </Container>
      </HashRouter>
    );
  }
}
 
export default Home;
