import React, { Component } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {CardPanel, Row, Col, Container} from 'react-materialize'
import PaymentVerification from "./PaymentVerification"

class Qr extends Component {
  constructor(props) {
    super(props);
    this.state = {  server: localStorage.getItem('server'),
                    amount: props.amount,
                    bch: props.bch,
                    label: props.label,
                    currency: props.currency,
                    copied: false,
                    verify: false,
                    received: false,
                  };
    this.handleCopy = this.handleCopy.bind(this);
    this.isPaid = this.isPaid.bind(this);
  }
  
  componentDidMount() {
    var query = this.state.server + "/api/payment?amount=" + this.state.bch + "&label=" + this.state.label
    
    fetch(query)
      .then(d => d.json())
      .then(d => {
        this.setState({
          apiResult: d,
          qrImg: this.state.server + d['payment']['qr_img'],
          addr: d['payment']['addr'],
          paymentUri: d['payment']['payment_uri']
        })
      })
      
      var timeoutId = setTimeout( () => this.setState({verify: true}), 10000)
      this.setState({timeoutId: timeoutId})
  }
  
  componentWillUnmount(){
    clearTimeout(this.state.timeoutId);
  }
  
  
  handleCopy(){
    this.setState({copied: true})
    window.Materialize.toast('Payment URI Copied!', 5000, 'green')
  }
  
  isPaid(state){
    //event.preventDefault();
    console.log(state)
    this.setState({received: state})
  }
  
  render() {
    if (!this.state.apiResult) return <h1>Loading...</h1>
      
    if(!this.state.received && !this.state.verify){
      return (
        <div>
        <Container>
          <h3>Pay {this.state.bch} BCH</h3>
          <CopyToClipboard text={this.state.paymentUri} onCopy={this.handleCopy.bind(this)}>
            <span><img src={this.state.qrImg} alt={this.state.paymentUri} className="target-ratio-resize"/></span>
          </CopyToClipboard>
          <ul>            
            <li>Amount: {this.state.amount} {this.state.currency} - {this.state.bch} BCH</li>
            <li>Address: <a target="_blank" href={"https://blockdozer.com/insight/address/" + this.state.addr}>{this.state.addr}</a></li>
            
            <li>Label: {this.state.label}</li>
          </ul>
        </Container>
        </div>
      );
    } else if(!this.state.received && this.state.verify){
      return (
        <div>
        <Container>
          <h3>Pay {this.state.bch} BCH</h3>
          <CopyToClipboard text={this.state.paymentUri} onCopy={this.handleCopy.bind(this)}>
            <span><img src={this.state.qrImg} alt={this.state.paymentUri} className="target-ratio-resize"/></span>
          </CopyToClipboard>
          <ul>            
            <li>Amount: {this.state.amount} {this.state.currency} - {this.state.bch} BCH</li>
            <li>Address: <a target="_blank" href={"https://blockdozer.com/insight/address/" + this.state.addr}>{this.state.addr}</a></li>
            
            <li>Label: {this.state.label}</li>
          </ul>
          <PaymentVerification addr={this.state.addr} amount={this.state.bch} isPaid={this.isPaid} />
          </Container>
        </div>
      );
    } else {
      return (
        <div>
        
          <Row>
            <Col s={12} l={6} className="offset-l3">
              <CardPanel className="green white-text">
                <span>
                  <h3>PAID {this.state.bch} BCH!</h3>
                  <h4>Thank You and Goodbye!</h4>
                </span>
              </CardPanel>
            </Col>
          </Row>

          <ul>            
            <li>Amount: {this.state.amount} {this.state.currency} - {this.state.bch} BCH</li>
            <li>Address: <a target="_blank" href={"https://blockdozer.com/insight/address/" + this.state.addr}>{this.state.addr}</a></li>
            <li>Label: {this.state.label}</li>
          </ul>
          
        </div>
      );
    }
  }
}

export default Qr; 
