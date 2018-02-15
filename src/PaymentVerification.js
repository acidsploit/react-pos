import React, { Component } from "react";
import {CardPanel, Row, Col} from 'react-materialize'
 
class PaymentVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {  server: localStorage.getItem('server'),
                    addr: props.addr,
                    amount: props.amount,
                    received: 0,
                  };
    this.fetchVerify = this.fetchVerify.bind(this);
  }
  
  componentDidMount() {
    var intervalId = setInterval( () => this.fetchVerify(), 4000)
    this.setState({intervalId: intervalId});

  }
  
  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }
  
  async fetchVerify(){
    if(!this.state.received){
      var query = this.state.server + "/api/verify?addr=" + this.state.addr + "&amount=" + this.state.amount
      console.log(query)
      
      fetch(query)
        .then(d => d.json())
        .then(d => {  this.setState({received: d['received']}); 
                      if (d['received'] === 1){
//                         window.Materialize.toast('<b>PAYMENT RECEIVED!</b><br />', 4000 , 'green');
//                         this.props.isPaid(true);
                      }
        })
    } else {
      window.Materialize.toast('<b>PAYMENT RECEIVED!</b><br />', 4000 , 'green')
      this.props.isPaid(true)
    }
  }
  
  render() {
    if (!this.state.received) {
      return (
        <Row>
          <Col s={12} l={6} className="offset-l3">
            <CardPanel className="red white-text">
              <span>
                <h4>Waiting for payment...</h4>
              </span>
            </CardPanel>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col s={12} l={6} className="offset-l3">
            <CardPanel className="green white-text">
              <span>
                <h3>RECEIVED!</h3>
              </span>
            </CardPanel>
          </Col>
        </Row>
      );
    }
  }
}

export default PaymentVerification; 
 
