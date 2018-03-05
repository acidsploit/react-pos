import React, { Component } from "react";
import {Input, Icon, Container, Row, Col, Button} from 'react-materialize'
import { v4 } from 'uuid';
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
      
    if (localStorage.getItem('source'))
      source = localStorage.getItem('source')
    else
      source = "kraken"
      
    if (localStorage.getItem('currency'))
      currency = localStorage.getItem('currency')
    else
      currency = "EUR"
      
    if (localStorage.getItem('tax')) {
      console.log(localStorage.getItem('tax'))
      tax = JSON.parse(localStorage.getItem('tax'))
    } else {
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
    }
      
    if (localStorage.getItem('discount')) {
      console.log(localStorage.getItem('discount'))
      discount = JSON.parse(localStorage.getItem('discount'))
    } else {
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
    }
      
      
    this.state = {  server: server,
                    name: shopName,
                    currency: currency,
                    source: source,
                    currencies: [currency],
                    sources: [source],
                    cancel: "close",
                    save: "Save",
                    wipe: "Wipe",
                    submitted: true,
                    wiped: false,
                    tax: tax,
                    discount: discount,
                  };
  
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleServer = this.handleServer.bind(this);
    this.handleWipe = this.handleWipe.bind(this);
    this.handleSource = this.handleSource.bind(this);
    this.handleCurrency = this.handleCurrency.bind(this);
    this.queryCurrencies = this.queryCurrencies.bind(this);
    this.handleTax = this.handleTax.bind(this);
    this.handleTaxPlus = this.handleTaxPlus.bind(this);
    this.handleTaxMin = this.handleTaxMin.bind(this);
    this.handleDiscount = this.handleDiscount.bind(this);
    this.handleDiscountPlus = this.handleDiscountPlus.bind(this);
    this.handleDiscountMin = this.handleDiscountMin.bind(this);
  }
  
  componentDidMount() {
    var query = this.state.server + "/api/rate"
    fetch(query)
      .then(results => results.json())
      .then(json => {
//         console.log(json)
        let data = []
        for(let key in json['sources']){
          data.push(json['sources'][key])
//           console.log(key, json['currencies'][key])
        }
        if (!this.state.source)
          this.setState({sources: data, source: data[0]})
        else
          //data.unshift("")
          this.setState({sources: data})
      })
    
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
      localStorage.setItem('tax', JSON.stringify(this.state.tax));
      localStorage.setItem('discount', JSON.stringify(this.state.discount));
      
      this.setState({ save: "Saved!",
                      submitted: true,
                      wipe: "wipe",
                      wiped: false,
                      cancel: "close",
      })
      
      window.Materialize.toast('<b>SETTINGS SAVED!</b><br />', 4000 , 'green')
    }
  }
  
  handleName(event){
    event.preventDefault()
    console.log(event.target.value)
    localStorage.setItem('name', event.target.value);
    this.setState({ name: event.target.value,
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
  }
  
  handleServer(event){
    event.preventDefault()
    //console.log(event.target.value)
    localStorage.setItem('server', event.target.value);
    this.setState({ server: event.target.value,
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
  }
  
  handleSource(event){
    event.preventDefault()
    //console.log(event.target.value)
    localStorage.setItem('source', event.target.value);
    this.setState({ source: event.target.value,
                    currencies: [],
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
    
    this.queryCurrencies()
    
  }
  
  handleCurrency(event){
    event.preventDefault()
//     console.log(event.target.value)
    localStorage.setItem('currency', event.target.value);
    this.setState({ currency: event.target.value,
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
  }
  
  handleTax(id, event){
    event.preventDefault()
    
    let items = this.state.tax
    
    let value = event.target.value
    
    if (/^\d+$/.test(value)){
      if(value >= 0 && value <= 100) {
        items[id]['value'] = value
        localStorage.setItem('tax', JSON.stringify(items));
        this.setState({ tax: items,
                        save: "Save",
                        wipe: "Wipe",
                        submitted: false,
                        wiped: false,
        })
      }
    }
  }
  
  handleDiscount(id, event){
    event.preventDefault()
    
    let items = this.state.discount
    
    let value = event.target.value
    
    if (/^\d+$/.test(value)){
      if(value >= 0 && value <= 100) {
        items[id]['value'] = value
        localStorage.setItem('discount', JSON.stringify(items));
        this.setState({ discount: items,
                        save: "Save",
                        wipe: "Wipe",
                        submitted: false,
                        wiped: false,
        })
      }
    }
  }
  
  handleTaxPlus(id, event){
    event.preventDefault()
    
    let items = this.state.tax
    items.push({  id: v4(),
                  value: "",
    })
    
    this.setState({ tax: items,
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
  }
  
  handleTaxMin(id, event){
    event.preventDefault()
    console.log(id)
    console.log(this.state.tax)
    
    let items = this.state.tax.filter((item, key) => key !== id )
    console.log(items)
    if (items.length === 0)
      items = [{  id: v4(),
                  value: "0",
      }]
    
    localStorage.setItem('tax', JSON.stringify(items));
    this.setState({ tax: items,
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
  }
  
  handleDiscountPlus(id, event){
    event.preventDefault()
    
    let items = this.state.discount
    items.push({  id: v4(),
                  value: "",
    })
    
    this.setState({ discount: items,
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
  }
  
  handleDiscountMin(id, event){
    event.preventDefault()
    console.log(id)
    console.log(this.state.tax)
    
    let items = this.state.discount.filter((item, key) => key !== id )
    console.log(items)
    if (items.length === 0)
      items = [{  id: v4(),
                  value: "0",
      }]
    
    localStorage.setItem('discount', JSON.stringify(items));
    this.setState({ discount: items,
                    save: "Save",
                    wipe: "Wipe",
                    submitted: false,
                    wiped: false,
    })
  }
  
  moveCaretAtEnd(e) {
    var temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
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
                  {this.state.sources.map(function(item) {
                      return (
                        <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                      )
                    })}
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
              <Col s={12} l={6} xl={6} className="offset-l3 offset-xl3">
              
                <Col s={12} l={6} xl={6} >
                  <h5 className="presetsh5">Tax Presets (%)</h5>
                  {this.state.tax.map((item, key) => {
                    let label = key === 0 ? "Default Tax" : "Sales Tax " + (key + 1)
                    return (
                      <div className="presets" key={item.id}>
                        <Col s={4} l={4} xl={4} >
                          <label className="left" htmlFor={item.id}>{label}</label>
                          <input key={item.id}  id={item.id} required  defaultValue={item.value} onChange={this.handleTax.bind(this, key)} />
                        </Col>
                        <Col s={7} l={7} xl={7} className="offset-l0 offset-xl0">
                          <div className="input-buttons">
                            <Button  floating waves='light' className="red input-btn" onClick={this.handleTaxMin.bind(this, key)}><Icon>remove</Icon></Button>
                            {this.state.tax.length === (key + 1) ? <Button  floating waves='light' className="green input-btn" onClick={this.handleTaxPlus.bind(this, key)}><Icon>add</Icon></Button> : ""}
                          </div>
                        </Col>
                      </div>
                      );
                    })}
                </Col>
                
                <Col s={12} l={6} xl={6} >
                  <h5 className="presetsh5">Discount Presets (%)</h5>
                  {this.state.discount.map((item, key) => {
                    let label = key === 0 ? "Default" : "Discount " + (key + 1)
                    return (
                      <div className="presets" key={item.id}>
                        <Col s={4} l={4} xl={4} >
                          <label className="left" htmlFor={item.id}>{label}</label>
                          <input key={item.id}  id={item.id} required  defaultValue={item.value} onChange={this.handleDiscount.bind(this, key)} />
                        </Col>
                        <Col s={7} l={7} xl={7}>
                          <div className="input-buttons">
                            <Button  floating waves='light' className="red input-btn" onClick={this.handleDiscountMin.bind(this, key)}><Icon>remove</Icon></Button>
                            {this.state.discount.length === (key + 1) ? <Button  floating waves='light' className="green input-btn" onClick={this.handleDiscountPlus.bind(this, key)}><Icon>add</Icon></Button> : ""}
                          </div>
                        </Col>
                        <br />
                      </div>
                    );
                  })}  
                </Col>
                
              </Col>
            </Row>
            <Row>
              <Col s={12} l={6} xl={6} className="offset-l3 offset-xl3">

              </Col>
              <Col s={12} l={6} xl={6} className="offset-l3 offset-xl3">

              </Col>
            </Row>
            <Row>
              <Col s={4} l={3} xl={3} className="offset-s4 offset-l3">
                <NavLink to="/"><Button large waves='light' className="red left bold-big"><Icon left>{this.state.cancel}</Icon>{this.state.cancel}</Button></NavLink>
              </Col>
              <Col s={4} l={3} xl={3}>
                <Button large waves='light' className="orange right bold-big" disabled={this.state.wiped} onClick={this.handleWipe.bind(this)}><Icon left>delete_forever</Icon>{this.state.wipe}</Button>
              </Col>
            </Row>
            <Row>
              <Col s={4} l={3} xl={3} className="offset-s8 offset-l6">
                
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
 
