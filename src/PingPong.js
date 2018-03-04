 
import React, { Component } from "react";
import {Container, Icon} from 'react-materialize';

 
class PingPong extends Component {
  constructor(props) {
    super(props);
    this.state = {  server: localStorage.getItem('server'),
                    pong: 0,
                  };
    this.ping = this.ping.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
  }
  
  componentDidMount() {
    this.ping()
    var intervalId = setInterval( () => this.ping(), 60000)
    this.setState({intervalId: intervalId});

  }
  
  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }
  
  handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
  
  ping(){
    var query = this.state.server + "/api/ping"
    
    fetch(query)
    .then(this.handleErrors)
    .then(d => d.json())
    .then(response => this.setState({ pong: response['pong'] }) )
    .catch(error => {
      console.log("Server did not return ping! :/", error);
      this.setState({ pong: 0 }) 
    });
  }
  
  render() {
    return (
      <Container>
        <span className="pingpong" >{this.state.pong ? <Icon tiny className="green-text">check</Icon> : <Icon tiny className="red-text">close</Icon>} <b>Server connection:</b> {this.state.server}</span>
      </Container>
    ); 
  }
}

export default PingPong;
