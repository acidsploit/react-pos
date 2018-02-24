import React, { Component } from "react";
import {Input, Icon, Container, Row, Col, Button} from 'react-materialize'

import {
  NavLink,
} from "react-router-dom";

class Settings extends Component {
  constructor(props) {
    super(props);
    var server
    var shopName
    var source
    var currency
    if (localStorage.getItem('server'))
      server = localStorage.getItem('server')
    else
      server = "http://localhost:8080"
      localStorage.setItem('server', server)
      
    if (localStorage.getItem('name'))
      shopName = localStorage.getItem('name')
    else
      shopName = "DEVZERO.BE"
      
    if (localStorage.getItem('source'))
      source = localStorage.getItem('source')
    else
      source = "kraken"
      
    if (localStorage.getItem('currency'))
      currency = localStorage.getItem('currency')
    else
      currency = "EUR"
      
    this.state = {  server: server,
                    name: shopName,
                    currency: currency,
                    source: source,
                    currencies: [currency],
                    cancel: "cancel",
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
                  };
  
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleServer = this.handleServer.bind(this);
    this.handleWipe = this.handleWipe.bind(this);
    this.handleSource = this.handleSource.bind(this);
    this.handleCurrency = this.handleCurrency.bind(this);
    this.queryCurrencies = this.queryCurrencies.bind(this);
  }
  
  componentDidMount() {
    this.queryCurrencies()
  }
  
  queryCurrencies() {
    var query = this.state.server + "/api/rate?source=" + this.state.source
    
    fetch(query)
      .then(results => results.json())
      .then(json => {
//         console.log(json)
        let data = []
        for(let key in json['currencies']){
          data.push(json['currencies'][key])
//           console.log(key, json['currencies'][key])
        }
        if (!this.state.currency)
          this.setState({currencies: data, currency: data[0]})
        else
          data.unshift("")
          this.setState({currencies: data})
      })
  }
  
  handleWipe(event) {
    event.preventDefault()
    localStorage.clear()
    this.setState({ wipe: "Wiped!",
                    cancel: "close",
                    wiped: true,
                    save: "save",
                    submitted: false,
    })
    
    window.Materialize.toast('<b>LOCAL STORAGE WIPED!</b><br />', 4000 , 'orange')
  }
  
  handleSubmit(event){
    //event.preventDefault()
    if (this.state.name && this.state.server) {
      localStorage.setItem('name', this.state.name);
      localStorage.setItem('server', this.state.server);
      localStorage.setItem('source', this.state.source);
      localStorage.setItem('currency', this.state.currency);
      
      this.setState({ save: "Saved!",
                      submitted: true,
                      wipe: "wipe",
                      wiped: false,
                      cancel: "close"
      })
      
      window.Materialize.toast('<b>SETTINGS SAVED!</b><br />', 4000 , 'green')
    }
  }
  
  handleName(event){
    event.preventDefault()
    console.log(event.target.value)
    this.setState({ name: event.target.value,
                    save: "Save",
                    cancel: "cancel",
                    submitted: false,
    })
  }
  
  handleServer(event){
    event.preventDefault()
    //console.log(event.target.value)
    this.setState({ server: event.target.value,
                    save: "Save",
                    cancel: "cancel",
                    submitted: false,
    })
  }
  
  handleSource(event){
    event.preventDefault()
    //console.log(event.target.value)
    this.setState({ source: event.target.value,
                    currencies: [],
                    save: "Save",
                    cancel: "cancel",
                    submitted: false,
    })
    
    this.queryCurrencies()
    
  }
  
  handleCurrency(event){
    event.preventDefault()
//     console.log(event.target.value)
    
    this.setState({ currency: event.target.value,
                    save: "Save",
                    cancel: "cancel",
                    submitted: false,
    })
  }
  
  render() {
    return (
      <Container>
        <h3>Settings</h3>
        <form>
          <Col s={12}>
            <Row>
              <Col s={12} l={6} xl={6} className="offset-l3 offset-xl3">
                <Input s={12} label="Shop Name" required validate defaultValue={this.state.name} onChange={this.handleName.bind(this)} />
              </Col>
            </Row>
            <Row>
              <Col s={12} l={6} xl={6} className="offset-l3 offset-xl3">
                <Input s={12} label="Server" required validate defaultValue={this.state.server} onChange={this.handleServer.bind(this)} />
              </Col>
            </Row>
            <Row>
              <Col s={12} l={6} xl={6} className="offset-l3 offset-xl3">
                <Input s={8} type='select' label='Exchange Rate Source' defaultValue={this.state.source} onChange={this.handleSource.bind(this)}>
                  <option value='cryptocompare'>CryptoCompare</option>
                  <option value='coinbase'>Coinbase</option>
                  <option value='kraken'>Kraken</option>
                </Input>
                <Input s={4} type='select' label='Currency' defaultValue={this.state.currency} onChange={this.handleCurrency.bind(this)}>
                  {this.state.currencies.map(function(item) {
                    return (
                      <option key={item} value={item}>{item}</option>
                    )
                  })}
                </Input>
              </Col>
            </Row>
            <Row>
              <Col s={4} l={3} xl={3} className="offset-s4 offset-l3">
                <NavLink to="/"><Button large waves='light' className="red left"><Icon left>{this.state.cancel}</Icon>{this.state.cancel}</Button></NavLink>
                
              </Col>
              <Col s={4} l={3} xl={3}>
                <Button large waves='light' className="green right" disabled={this.state.submitted} onClick={this.handleSubmit.bind(this)}><Icon left>save</Icon>{this.state.save}</Button>
              </Col>
            </Row>
            <Row>
              <Col s={4} l={3} xl={3} className="offset-s8 offset-l6">
                <NavLink to="/"><Button large waves='light' className="orange right" disabled={this.state.wiped} onClick={this.handleWipe.bind(this)}><Icon left>delete_forever</Icon>{this.state.wipe}</Button></NavLink>
              </Col>
            </Row>
          </Col>
        </form>
        {        
//         <div align='left'>
//           <h4>DEBUG</h4>
//           <ul>
//             <li>Name: {this.state.name}</li>
//             <li>Server: {this.state.server}</li>
//             <li>Source: {this.state.source}</li>
//             <li>Currency: {this.state.currency}</li>
//           </ul>
//         </div>
        }
      </Container>
    );
  }
}
 
export default Settings;
 
