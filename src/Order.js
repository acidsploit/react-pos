import React, { Component } from "react";
import {
  //Input, 
  Container, Row, Col, Button, Icon, Input} from 'react-materialize'
import './style.css';
 import {
  NavLink
} from "react-router-dom";
import {default as UUID} from "node-uuid";


import NumPad from "./NumPad";
import Qr from "./Qr";
import PingPong from './PingPong';

// import ReactDragList from "react-drag-list";

class Order extends Component {
constructor(props) {
    super(props);
    this.state = {name: localStorage.getItem('name'),
                  server: localStorage.getItem('server'),
                  amount: "0",
                  bch: 0,
                  exchangeRate: 0,
                  label: "LABEL",
                  currency: localStorage.getItem('currency'),
                  source: localStorage.getItem('source'),
                  submit: 0,
                  clear: 0,
                  items: [],
                  subtotal: 0,
                  subtotalBch: 0,
                  tax: JSON.parse(localStorage.getItem('tax'))[0]['value'],
                  taxPresets: JSON.parse(localStorage.getItem('tax')),
                  discount: JSON.parse(localStorage.getItem('discount'))[0]['value'],
                  discountPresets: JSON.parse(localStorage.getItem('discount')),
                  discountBch: 0,
                  taxBch: 0,
                  totalBch: 0,
                  total: 0,
    };

    // This binding is necessary to make `this` work in the callback

    this.handleItem = this.handleItem.bind(this);
    this.queryCurrency = this.queryCurrency.bind(this);
    this.toggleCurrency = this.toggleCurrency.bind(this);
//     this.handleDelete = this.handleDelete.bind(this);
    this.handleTax = this.handleTax.bind(this);
    this.handleDiscount = this.handleDiscount.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.cancelPayment = this.cancelPayment.bind(this);
    this.saveOrder = this.saveOrder.bind(this);
    this.getColor = this.getColor.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
    this.handleMin = this.handleMin.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }
  
  handleClear(event){
    event.preventDefault()
    
    this.setState({ submit:0,
                    clear: 0,
                    amount: "0",
                    bch: 0,
                    label: "LABEL",
                    items: [],
                    subtotal: 0,
                    subtotalBch: 0,
                    discountBch: 0,
                    taxBch: 0,
                    totalBch: 0,
                    total: 0,
    })
    
    window.Materialize.toast('Order Cleared!', 3000, 'red')
    
    this.queryCurrency(this.state.currency)
  }
  
  componentWillMount() {
    this.queryCurrency(this.state.currency)
  }
  
  calculateTotals(items){
    let exr = this.state.exchangeRate
    let tax = this.state.tax
    let discount = this.state.discount
    
    let subbch = 0
    items.map(function(item) {
      return subbch += parseFloat(item.bch * item.count)
    })
    
    let subtotal = subbch * exr
        
    let discountbch = subbch * (discount/100)
    let taxbch = (subbch - discountbch) * (tax/100)
    let totalbch = (subbch - discountbch) * (1 + (tax/100))
    let total = totalbch * exr
    
    this.setState({ subtotalBch: parseFloat(subbch).toFixed(8),
                    subtotal: parseFloat(subtotal).toFixed(8),
                    discountBch: parseFloat(discountbch).toFixed(8),
                    taxBch: parseFloat(taxbch).toFixed(8),
                    totalBch: parseFloat(totalbch).toFixed(8),
                    total: parseFloat(total).toFixed(8),
    })
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
    this.calculateTotals(this.state.items)
  }
  
  handleItem(amount, event) {
    event.preventDefault();
    console.log(amount)
    if(amount !== "0" && amount !== ""){
      //var label = this.state.name + ':' + UUID.v4();      
      var amt = parseFloat(amount).toFixed(2)
      var exr = parseFloat(this.state.exchangeRate).toFixed(2)
      var bch = ( 1 / exr ) * amt
      bch = parseFloat(bch).toFixed(8)
      
      let item = {  id: this.state.items[0] ? this.state.items[0].id + 1 : 1,
                    name: "Item" + (this.state.items[0] ? this.state.items[0].id + 1 : 1),
                    currency: this.state.currency,
                    bch: bch,
                    exchangeRATE: this.state.exchangeRate,
                    timestamp: parseFloat(Date.now() / 1000).toFixed(4),
                    count: 1,
                 }
      
      let items = this.state.items
      items.unshift(item)
      
      this.setState({ //submit: 1,
                      items: items,
                      amount: "0",
                    });
      this.calculateTotals(items)
      } else {
        window.Materialize.toast('<b>No amount specified to charge!</b>', 5000 , 'red')
      }
  }
  
  handleTax(event){
    event.preventDefault()
    
    this.setState({ tax: event.target.value})
    this.calculateTotals(this.state.items)
  }
  
  handleDiscount(event){
    event.preventDefault()
    
    this.setState({discount: event.target.value})
    this.calculateTotals(this.state.items)
  }
  
  handlePayment(event){
    event.preventDefault()
    if (this.state.items.length === 0){
      window.Materialize.toast('<b>No items to sell!</b>', 5000 , 'red')
    } else {
      var label = this.state.name + ':' + UUID.v4().slice(-12, -1);
      this.saveOrder(label)
      var timeoutId = setTimeout( () => this.setState({submit: 1, clear: 1, label: label}), 1000)
      this.setState({timeoutId: timeoutId})
//       this.setState({ submit: 1,
//                       label: label,
//       });
    }
  }
  
  componentWillUnmount(){
    clearTimeout(this.state.timeoutId);
  }
  
  saveOrder(label){
    fetch(this.state.server + '/api/order', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  label: label,
                              items: this.state.items,
                              discount: this.state.discount,
                              tax: this.state.tax,
                              totalBCH: this.state.totalBch,
                              subtotalBCH: this.state.subtotalBch,
                              discountBCH: this.state.discountBch,
                              taxBCH: this.state.taxBch,
                              exchangeRATE: this.state.exchangeRate,
                              currency: this.state.currency,
      })
    })
  }
  
  cancelPayment(event){
    event.preventDefault()
    
    this.setState({ submit:0})
    
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
  
  handlePlus(id, event){
    event.preventDefault()
    
    let items = this.state.items
    let index = items.findIndex( item => item.id === id )
    
    console.log(index)
    
    items[index]['count']++
    
    this.setState({ items: items})
    this.calculateTotals(items)
  }
  
  handleMin(id, event){
    event.preventDefault()
    
    let items = this.state.items
    let index = items.findIndex( item => item.id === id )
    
    console.log(index)
    
    items[index]['count']--
    
    console.log(items[index]['count'])
    
    if (items[index]['count'] === 0){
      items = this.state.items.filter((item, key) => item.id !== id )
      this.setState({ items: items})
      this.calculateTotals(items)
    } else {
      this.setState({ items: items})
      this.calculateTotals(items)
    }
  }
  
//   handleDelete(id, event){
//     event.preventDefault()
//     
//     //console.log(event)
//     
//     let items = this.state.items.filter((item, key) => key !== id )
//   
//     this.setState({ items: items})
//     
//     this.calculateTotals(items)
//   }
  
  render() {
    if (this.state.exchangeRate === 0) return <h1>Fetching Exchange Rate...</h1>
    if (this.state.submit === 0) {
      return (
        <div>
          <Row>
            <Col s={12} l={5} xl={5} className="offset-l0 offset-xl0">
              <NumPad title="New Item" submitIcon="add_shopping_cart" amount={this.state.amount} currency={this.state.currency} exchangeRate={this.state.exchangeRate} handler={this.handleItem} toggleCurrency={this.toggleCurrency}/>
              <p><b>Currency Source: </b>{this.state.source}</p>
            </Col>
            <Col s={12} l={6} xl={6} className="offset-l0 offset-xl0">
              <div className="order-totals">
                <form>
                  <Row>
                    <Col s={12} l={12} xl={12} className="offset-l0 offset-xl0">
                      <Input s={6} l={2} xl={2}  type='select' label='Discount %' defaultValue={this.state.discount} onChange={this.handleDiscount.bind(this)}>
                      {this.state.discountPresets.map(item => {
                        return (
                         <option key={item.id} value={item.value}>{item.value + "%"}</option> 
                        )
                      })}
                      </Input>
                      <Input s={6} l={2} xl={2}  type='select' label='Sales Tax %' defaultValue={this.state.tax} onChange={this.handleTax.bind(this)}>
                      {this.state.taxPresets.map(item => {
                        return (
                         <option key={item.id} value={item.value}>{item.value + "%"}</option> 
                        )
                      })}
                      </Input>
                      <Col s={6} l={4} xl={4} >
                        <div className="subtotal-right"><h4>Total</h4></div>
                        <div className="subtotal-right"><h5>{parseFloat(this.state.totalBch * this.state.exchangeRate).toFixed(2)} {this.state.currency}</h5></div>
                        <div className="subtotal-right">{parseFloat(this.state.totalBch).toFixed(8)} BCH</div>
                      </Col>
                      <Col s={6} l={4} xl={4} >
                        <div className="subtotal-right"><h4>Discount &amp; Tax</h4></div>
                        <div className="subtotal-right">Discount: {parseFloat(this.state.discount).toFixed(0)} % - {parseFloat(this.state.discountBch * this.state.exchangeRate).toFixed(2)} {this.state.currency}</div>
                        <div className="subtotal-right">Sales Tax: {parseFloat(this.state.tax).toFixed(0)} % + {parseFloat(this.state.taxBch * this.state.exchangeRate).toFixed(2)} {this.state.currency}</div>
                      </Col>
                    </Col>
                  </Row>
                  <Row>
                    <Col s={4} l={4} xl={4} className="offset-l0 offset-xl0">
                      <Button large waves='light' className="green left bold-big" onClick={this.handlePayment.bind(this)}><Icon left>payment</Icon>Pay</Button>
                    </Col>
                    <Col s={4} l={4} xl={4} className="offset-l0 offset-xl0">
                      { this.state.clear === 0 ? <NavLink to="/"><Button large waves='light' className="red left bold-big"><Icon left>cancel</Icon>Cancel</Button></NavLink>
                                                : <Button large waves='light' className="orange left bold-big" onClick={this.handleClear.bind(this)}><Icon left>clear</Icon>Clear!</Button>
                      }
                    </Col>
                    <Col s={4} l={4} xl={4} className="offset-l0 offset-xl0">
                      <div className="subtotal-right"><h5>Subtotal:</h5></div>
                      <div className="subtotal-right">{parseFloat(this.state.subtotalBch * this.state.exchangeRate).toFixed(2)} {this.state.currency}</div>
                      <div className="subtotal-right">{parseFloat(this.state.subtotalBch).toFixed(8)} BCH</div>
                    </Col>
                  </Row>
                </form>
              </div>
              <div className="order-items">
                {this.state.items.map((item, key) => {
                  return (
                    <Row className="order-item" key={key}>
                      <Col s={1} l={1} xl={1} className="offset-l0 offset-xl0">
                        <Icon small className={"collection-item circle white-text " + this.getColor(item.id - 1)} children="chevron_right" />
                        
                      </Col>
                      <Col s={4} className="offset-l0 offset-xl0">
                        <span className="left"><b>{item.name}</b></span><br />
                        <span className="left bold">{parseFloat(item.bch * this.state.exchangeRate).toFixed(2)} {this.state.currency}</span><br />
                        <span className="left mono-tiny">{item.bch} BCH</span><br />
                      </Col>
                      <Col s={1} className="offset-l0 offset-xl0">
                        <span className="left"><b>x{item.count}</b></span><br />
                      </Col>
                      <Col s={3} className="offset-l0 offset-xl0">
                        <div className="item-total">
                          <span className="right"><b>{parseFloat(item.count * item.bch * this.state.exchangeRate).toFixed(2)} {this.state.currency}</b></span><br />
                          <span className="right mono-tiny">{parseFloat(item.count * item.bch).toFixed(8)} BCH</span>
                        </div>
                      </Col>
                      <Col s={3} className="offset-l0 offset-xl0">
                        <div className="order-buttons right">
                          <Button  floating waves='light' className="green order-btn" onClick={this.handlePlus.bind(this, item.id)}><Icon>add</Icon></Button>
                          { item.count > 1  ? <Button  floating waves='light' className="red order-btn" onClick={this.handleMin.bind(this, item.id)}><Icon>remove</Icon></Button>
                                            : <Button  floating waves='light' className="red order-btn" onClick={this.handleMin.bind(this, item.id)}><Icon>clear</Icon></Button>
                          }
                          <br /><span className="right mono-tiny">({parseFloat(item.timestamp).toFixed(0)})</span>
                        </div>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </Col>
          </Row>
          <PingPong />
        </div>
      );
    } else {
      return (
        <div>
        <Container>
          <Qr amount={parseFloat(this.state.total).toFixed(2)} bch={this.state.totalBch} label={this.state.label} currency={this.state.currency} />
          <ul>
            <li><Button node="button" large waves="light" className="red" onClick={this.cancelPayment.bind(this)}><Icon left>close</Icon>Close</Button></li>
          </ul>
        </Container>
        </div>
      );
    }
  }
}
 
export default Order;
