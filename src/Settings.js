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
    if (localStorage.getItem('server'))
      server = localStorage.getItem('server')
    else
      server = "http://localhost:8081"
      
    if (localStorage.getItem('name'))
      shopName = localStorage.getItem('name')
    else
      shopName = "DEVZERO.BE"
      
    this.state = {  server: server,
                    name: shopName,
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
  }
  
  componentDidMount() {
    //localStorage.clear()
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
      
      this.setState({ save: "Saved!",
                      submitted: true,
                      wipe: "wipe",
                      wiped: false,
                      cancel: "close"
      })
      
      window.Materialize.toast('<b>SETTINGS SAVED!</b><br />', 4000 , 'green')
        
    }
    
    //console.log(localStorage.getItem('name'), localStorage.getItem('server'))
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
      </Container>
    );
  }
}
 
export default Settings;
 
