import React, { Component } from "react";
import {Button, Container, Icon, Row, Col} from 'react-materialize'
import './style.css';
import {default as UUID} from "node-uuid";
import Qr from "./Qr";
import NumPad from "./NumPad";
import PingPong from './PingPong';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {  name: localStorage.getItem('name'),
                    server: localStorage.getItem('server'),
                    amount: "0",
                    bch: 0,
                    exchangeRate: 0,
                    label: "LABEL",
                    currency: localStorage.getItem('currency'),
                    source: localStorage.getItem('source'),
                    submit: 0,
                  };

    // This binding is necessary to make `this` work in the callback
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelPayment = this.cancelPayment.bind(this);
    this.toggleCurrency = this.toggleCurrency.bind(this);
    this.queryCurrency = this.queryCurrency.bind(this);
  }
  
  componentWillMount() {
    this.queryCurrency(this.state.currency)
  }
  
  // TODO
  toggleCurrency(amount, event){
    event.preventDefault();
    this.setState({ currency: this.state.currency === 'USD' ? localStorage.getItem('currency') : 'USD',
                    amount: amount,
    });
    this.queryCurrency(this.state.currency === 'USD' ? localStorage.getItem('currency') : 'USD' )
    window.Materialize.toast('<b>Toggle currency</b>', 3000 , 'green')
  }
  
  queryCurrency(currency) {
    var query = this.state.server + "/api/rate?source=" + this.state.source + "&currency=" + currency
    fetch(query)
      .then(d => d.json())
      .then(d => {
        this.setState({
          exchangeRate: parseFloat(d['price']).toFixed(2),
        })
        window.Materialize.toast('Exchange Rate Fetched!<br />1 BCH = ' 
                                  + parseFloat(d['price']).toFixed(2) 
                                  + ' ' + currency, 3000, 'green')
      })
  }
  
  handleSubmit(amount, event) {
    event.preventDefault();
    console.log(amount)
    if(amount !== "0" && amount !== ""){
      var label = this.state.name + ':' + UUID.v4().slice(-12, -1);      
      var amt = parseFloat(amount).toFixed(2)
      var exr = parseFloat(this.state.exchangeRate).toFixed(2)
      var bch = ( 1 / exr ) * amt
      bch = parseFloat(bch).toFixed(8)
      
      this.setState({ submit: 1,
                      amount: amount,
                      label: label,
                      bch: "" + bch,
                    });
      } else {
        window.Materialize.toast('<b>No amount specified to charge!</b>', 5000 , 'red')
      }
  }
  
  cancelPayment(event) {
    //event.preventDefault();
    this.setState({ submit:0,
                    amount: "0"
                 })
  }
  
  render() {
    if (this.state.exchangeRate === 0) return <h1>Fetching Exchange Rate...</h1>
    if (this.state.submit === 0) {
      return (
        <div>
        {
         // <p>1 BCH = {this.state.exchangeRate} {this.state.currency}</p>
        } 
        <Row>
        <Col s={12} l={4} xl={4} className="offset-l4 offset-xl4">
          <NumPad title="Payment" submitIcon="check" amount={this.state.amount} currency={this.state.currency} exchangeRate={this.state.exchangeRate} handler={this.handleSubmit} toggleCurrency={this.toggleCurrency}/>
          <p><b>Currency Source: </b>{this.state.source}</p>
        </Col>
        </Row>
        <PingPong />
        </div>
      );
    } else {
      return (
        <div>
        <Container>
          <Qr amount={this.state.amount} bch={this.state.bch} label={this.state.label} currency={this.state.currency} />
          <ul>
            <li><Button node="button" large waves="light" className="red" onClick={this.cancelPayment.bind(this)}><Icon left>close</Icon>Close</Button></li>
          </ul>
        </Container>
        </div>
      );
    }
  }
}
 
export default Payment;
