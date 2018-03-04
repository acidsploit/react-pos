import React, { Component } from "react";
import {Icon, CardPanel, Container, Row, Col, Button} from 'react-materialize';
import PingPong from './PingPong';
import { v4 } from 'uuid';
import {
  NavLink,
  HashRouter
} from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    
    // Set initial values for demo purpose
    var server
    var shopName
    var source
    var currency
    var tax
    var discount
    if (localStorage.getItem('server'))
      server = localStorage.getItem('server')
    else
      server = "https://demo.pyxpub.io"
      localStorage.setItem('server', server)
      
    if (localStorage.getItem('name'))
      shopName = localStorage.getItem('name')
    else
      shopName = "PYXPUB.IO"
      localStorage.setItem('name', shopName)
      
    if (localStorage.getItem('source'))
      source = localStorage.getItem('source')
    else
      source = "kraken"
      localStorage.setItem('source', source)
      
    if (localStorage.getItem('currency'))
      currency = localStorage.getItem('currency')
    else
      currency = "EUR"
      localStorage.setItem('currency', currency)
      
    if (localStorage.getItem('tax'))
      tax = JSON.parse(localStorage.getItem('tax'))
    else
      tax = [
              { id: v4(),
                value: "0"
              },
              { id: v4(),
                value: "6"
              },
              { id: v4(),
                value: "12"
              },
            ]
      localStorage.setItem('tax', JSON.stringify(tax))
      
    if (localStorage.getItem('discount'))
      discount = JSON.parse(localStorage.getItem('discount'))
    else
      discount =  [
                    { id: v4(),
                      value: "3"
                    },
                    { id: v4(),
                      value: "0"
                    },
                    { id: v4(),
                      value: "5"
                    },
                    { id: v4(),
                      value: "10"
                    },
                  ]
      localStorage.setItem('discount', JSON.stringify(discount))
    
    this.state = {  name: shopName,
                    server: server,
                  };
  }
  
  componentWillMount() {
//     var shopName = localStorage.getItem('name');
//     var server = localStorage.getItem('server');
//     
//     //console.log(shopName, server)
//     
//     this.setState({  name: shopName,
//                     server: server,
//                   })
  }
  
  
  render() {
    let greeting = null
    if (this.state.name && this.state.server){
      greeting = <h1>{this.state.name}!</h1>
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
              <Col s={12} className='grid-index'><h3>Choose your action:</h3></Col>
            </Row>
            <Row>
              <Col s={12} l={4} className='grid-index action'><NavLink to="/order"><Button large waves='light' className="blue lighten-1 btn-action"><Icon left>shopping_cart</Icon>ORDER</Button></NavLink></Col>
              <Col s={12} l={4} className='grid-index action'><NavLink to="/payment"><Button large waves='light' className="blue lighten-1 btn-action"><Icon left>payment</Icon>PAYMENT</Button></NavLink></Col>
              <Col s={12} l={4} className='grid-index action'><NavLink to="/ledger"><Button large waves='light' className="blue lighten-1 btn-action"><Icon left>list</Icon>LEDGER</Button></NavLink></Col>
              {
              //<Col s={12} l={4} className='grid-index action'><NavLink to="/settings"><Button large waves='light' icon="settings" className="blue lighten-1"/></NavLink></Col>
              }
            </Row>
          </CardPanel>
          <PingPong />
        </Container>
      </HashRouter>
    );
  }
}
 
export default Home;
