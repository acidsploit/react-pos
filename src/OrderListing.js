import React, { Component } from "react";
import {Row, Col, Container, Icon, Button} from 'react-materialize'
import Timestamp from "react-timestamp";

class OrderListing extends Component {
  constructor(props) {
    super(props);
    this.state = {  server: localStorage.getItem('server'),
                    label: props.label,
                    tx: props.tx,
                  };
    this.queryOrder = this.queryOrder.bind(this);
    this.getColor = this.getColor.bind(this);
  }
  
  componentWillMount() {
    this.queryOrder(this.state.label)
  }
  
  componentWillReceiveProps(nextProps) {
  // check this.props vs nextProps and setState!
    this.setState({ label: nextProps.label,
                    tx: nextProps.tx,
    })
    this.queryOrder(nextProps.label)
  }
  
  queryOrder(label){
    var query = this.state.server + "/api/order?label=" + label
    
    fetch(query)
      .then(d => d.json())
      .then(d => {
        //console.log(d['items'])
        this.setState({
          data: d,
          items: d['items'],
        })
      })
  }
  
  getColor(id){
    let colors = [  "blue lighten-1",
                    "orange",
                    "teal",
                    "red",
                    "purple",
                 ]
                 
    let color = id % colors.length
    
    return colors[color]
  }
  
  render() {
    if (!this.state.data) return <h1>Loading...</h1>
      
    return (
      <div>
        <Container>
          <Row  className="row-top">
            <Col s={12} l={8} xl={8} className="offset-l2 offset-xl2">
              <Row>
                <Col s={6} l={4} xl={4} >
                  <div className="subtotal-left"><h4>Total</h4></div>
                  <div className="subtotal-left"><h5>{parseFloat(this.state.data['totalBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</h5></div>
                  <div className="subtotal-left">{parseFloat(this.state.data['totalBCH']).toFixed(8)} BCH</div>
                </Col>
                <Col s={6} l={4} xl={4} >
                  <div className="subtotal-left"><h4>Discount &amp; Tax</h4></div>
                  <div className="subtotal-left">Subtotal: {parseFloat(this.state.data['subtotalBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                  <div className="subtotal-left">Discount: {parseFloat(this.state.data['discount']).toFixed(0)} % - {parseFloat(this.state.data['discountBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                  <div className="subtotal-left">Sales Tax: {parseFloat(this.state.data['tax']).toFixed(0)} % + {parseFloat(this.state.data['taxBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                </Col>
                <Col s={12} l={4} xl={4} >
                  <div className="subtotal-right"><h5><Timestamp time={this.state.data['timestamp']} format='full' includeDay /></h5></div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col s={12} l={8} xl={8} className="offset-l2 offset-xl2">
              {this.state.tx !== 'NoTX' ? <Button large waves='light' className='left green darken-2  bold-big' node='a' target='_blank' href={"https://blockdozer.com/insight/tx/" + this.state.tx}><Icon left>payment</Icon>payment</Button> : <h4 className="left">No payment found!</h4>}
            </Col>
          </Row>
          <Row>
            <Col s={12} l={8} xl={8} className="offset-l2 offset-xl2">
              <div className="detail-items">
                {this.state.items.reverse().map((item, key) => {
                  return (
                    <Row className="detail-item" key={key}>
                      <Col s={1} l={1} xl={1} className="offset-l0 offset-xl0">
                        <Icon small className={"circle white-text " + this.getColor(item.id - 1)} children="chevron_right" />
                      </Col>
                      <Col s={6} className="offset-l0 offset-xl0">
                        <span className="left"><b>{item.name}</b></span><br />
                        <span className="left bold">{parseFloat(item.bch * item.exchangeRATE).toFixed(2)} {item.currency}</span><br />
                        <span className="left mono-tiny">{item.bch} BCH</span><br />
                        <span className="left mono-tiny">({parseFloat(item.timestamp).toFixed(0)})</span>
                      </Col>
                      <Col s={1} className="offset-l0 offset-xl0">
                        <span className="right"><b>x{item.count}</b></span><br />
                      </Col>
                      <Col s={4} className="offset-l0 offset-xl0">
                          <span className="right"><b>{parseFloat(item.count * item.bch * item.exchangeRATE).toFixed(2)} {item.currency}</b></span><br />
                          <span className="right mono-tiny">{parseFloat(item.count * item.bch).toFixed(8)} BCH</span>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </Col>
          </Row>
          <Row>
            <Col s={12} l={8} xl={8} className="offset-l2 offset-xl2">
              <Row>
                <Col s={4} l={3} xl={3} className="offset-s0 offset-l4 offset-xl4">
                  <div className="subtotal-right">Subtotal:</div>
                  <div className="subtotal-right">Discount: {parseFloat(this.state.data['discount']).toFixed(0)} %</div>
                  <div className="subtotal-right">=></div>
                  <div className="subtotal-right">Sales Tax: {parseFloat(this.state.data['tax']).toFixed(0)} %</div>
                  <div className="subtotal-right bold">Total</div>
                </Col>
                <Col s={5} l={3} xl={3} className="">
                  <div className="subtotal-right mono-tiny">{parseFloat(this.state.data['subtotalBCH']).toFixed(8)} BCH</div>
                  <div className="subtotal-right mono-tiny">- {parseFloat(this.state.data['discountBCH']).toFixed(8)} BCH</div>
                  <div className="subtotal-right mono-tiny">{(parseFloat(this.state.data['subtotalBCH'] - this.state.data['discountBCH'])).toFixed(8)} BCH</div>
                  <div className="subtotal-right mono-tiny">+ {parseFloat(this.state.data['taxBCH']).toFixed(8)} BCH</div>
                  <div className="subtotal-right bold">{parseFloat(this.state.data['totalBCH']).toFixed(8)} BCH</div>
                </Col>
                <Col s={3} l={2} xl={2} className="">
                  <div className="subtotal-right">{parseFloat(this.state.data['subtotalBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                  <div className="subtotal-right">- {parseFloat(this.state.data['discountBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                  <div className="subtotal-right">{(parseFloat(this.state.data['subtotalBCH'] - this.state.data['discountBCH']) * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                  <div className="subtotal-right">+ {parseFloat(this.state.data['taxBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                  <div className="subtotal-right bold">{parseFloat(this.state.data['totalBCH'] * this.state.data['exchangeRATE']).toFixed(2)} {this.state.data['currency']}</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default OrderListing; 
