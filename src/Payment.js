import React, { Component } from "react";
import {Button, Container, Icon} from 'react-materialize'
import './style.css';
import {default as UUID} from "node-uuid";
import Qr from "./Qr";
import NumPad from "./NumPad";

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {  name: localStorage.getItem('name'),
                    amount: "0",
                    bch: 0,
                    exchangeRate: 0,
                    label: "LABEL",
                    currency: 'EUR',
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
  toggleCurrency(event){
    event.preventDefault();
    this.setState({currency: this.state.currency === 'USD' ? 'EUR' : 'USD' });
    this.queryCurrency(this.state.currency === 'USD' ? 'EUR' : 'USD')
    window.Materialize.toast('<b>Toggle currency</b>', 3000 , 'green')
  }
  
  queryCurrency(currency) {
    var query = "https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/?convert=" + currency
    fetch(query)
      .then(d => d.json())
      .then(d => {
        this.setState({
          exchangeRate: parseFloat(d['0']['price_' + currency.toLowerCase()]).toFixed(2),
        })
        window.Materialize.toast('Exchange Rate Fetched!<br />1 BCH = ' 
                                  + parseFloat(d['0']['price_' + currency.toLowerCase()]).toFixed(2) 
                                  + ' ' + currency, 3000, 'green')
      })
  }
  
  handleSubmit(amount, event) {
    event.preventDefault();
    if(amount !== "0"){
      var label = this.state.name + ':' + UUID.v4();      
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
          <NumPad amount={this.state.amount} currency={this.state.currency} exchangeRate={this.state.exchangeRate} handler={this.handleSubmit} toggleCurrency={this.toggleCurrency}/>
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
