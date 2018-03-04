import React, { Component } from "react";
import {CardPanel, Container, Row, Col, Button, Icon} from 'react-materialize'
import './style.css';

class NumPad extends Component {
  constructor(props) {
    super(props);
    this.state = {  amount: this.props.amount,
                    currency: this.props.currency,
                    exchangeRate: this.props.exchangeRate,
                    title: this.props.title,
                    submitIcon: this.props.submitIcon,
                    submit: 0,
                    bch: 0,
                  };

    // This binding is necessary to make `this` work in the callback
    this.addText = this.addText.bind(this);
    this.delText = this.delText.bind(this);
    this.clearText = this.clearText.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
  // check this.props vs nextProps and setState!
    this.setState({ currency: nextProps.currency,
                    exchangeRate: nextProps.exchangeRate,
                    amount: nextProps.amount,
                    bch: parseFloat((1 / nextProps.exchangeRate) * nextProps.amount).toFixed(8)
    })
  }
  
  addText(text) {
    var t = this.state.amount;
    if (t === "0"){
      t = "" + text;
    } else {
      t = t + text;
    }
    this.setState({ amount:t,
                    bch: parseFloat((1 / this.state.exchangeRate) * t).toFixed(8)
    });
  }
  
  delText() {
    var t = this.state.amount;
    t = t.slice(0, -1);
    this.setState({ amount:t,
                    bch: parseFloat((1 / this.state.exchangeRate) * t).toFixed(8)
    });
  }
  
  clearText() {
    var t = "0"
    this.setState({ amount:t,
                    bch: parseFloat((1 / this.state.exchangeRate) * t).toFixed(8)
    });
  }
  
  render() {
    return (
      <div>
          <h3>{this.props.title}</h3>
          <Container>
            <form>
              <Row>
                <Col s={12}>
                <Col s={12} className="">
                    <CardPanel className="grey lighten-2 black-text">
                    <div className="input-field">
                      <label id="currency" htmlFor="amount">{this.state.currency}</label>
                      <input id="amount" type="text" pattern="[0-9.]+(\.[0-9][0-9]?)?" value={this.state.amount} required readOnly></input>
                    </div>
                      
                    </CardPanel>
                    <span className="left calculator-footer">{this.state.amount} {this.state.currency} = {this.state.bch} BCH</span>
                    <span className="right calculator-footer">1 BCH = {this.state.exchangeRate} {this.state.currency}</span>
                </Col>
                  <div className="buttons">
                    <Col s={4}><Button large waves="light" className="blue ibtn" onClick={this.props.toggleCurrency.bind(this, this.state.amount)}>{this.state.currency === 'USD' ? localStorage.getItem('currency') : 'USD'}</Button></Col>
                    <Col s={4}><Button large waves="light" className="red darken-1 ibtn" onClick={this.clearText.bind(this)}>C</Button></Col>
                    <Col s={4}><Button large waves="light" className="yellow darken-3 ibtn" onClick={this.delText.bind(this)}>&#9003;</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 1)}>1</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 2)}>2</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 3)}>3</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 4)}>4</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 5)}>5</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 6)}>6</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 7)}>7</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 8)}>8</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 9)}>9</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, ".")}>.</Button></Col>
                    <Col s={4}><Button large waves="light" className="ibtn" onClick={this.addText.bind(this, 0)}>0</Button></Col>
                    <Col s={4}><Button large waves="light" className="green ibtn" ref="submit" onClick={this.props.handler.bind(this, this.state.amount)}><Icon>{this.state.submitIcon}</Icon></Button></Col>
                  </div>
                </Col>
              </Row>
            </form>
          </Container>
        </div>
    );
  }
}
 
export default NumPad; 
