import React, { Component } from "react";
import {
  //Input, 
  Container, Row, Col, Button, CardPanel} from 'react-materialize'
import './style.css';
 import {
  NavLink
} from "react-router-dom";

class Order extends Component {
constructor(props) {
    super(props);
    this.state = {amount: "0"};

    // This binding is necessary to make `this` work in the callback
    this.addText = this.addText.bind(this);
    this.delText = this.delText.bind(this);
    this.clearText = this.clearText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(event) {
    alert('An amount was submitted: ' + this.state.amount);
    event.preventDefault();
  }
  
  addText(text) {
    console.log('The link was clicked.' + text);
    var t = this.state.amount;
    if (t === "0"){
      t = "" + text;
    } else {
      t = t + text;
    }
    this.setState({amount:t});
    console.log('The link was clicked.' + t);
  }
  
  delText() {
    console.log('The del was clicked.');
    var t = this.state.amount;
    t = t.slice(0, -1);
    this.setState({amount:t});
    console.log('The del was clicked.' + t);
  }
  
  clearText() {
    console.log('The clear was clicked.');
    var t = "0"
    this.setState({amount:t});
    console.log('The clear was clicked.' + t);
  }
  
  
  render() {
    return (
      <div>
        <h3>Order</h3>
        <Container >
        <Row>
          <Col s={12} l={6} className="offset-l3">
            <CardPanel className="red white-text">
              <span>
                <h3>Under Construction!</h3>
                <NavLink to="/"><Button large waves='light' className="blue lighten-1" icon="home"/></NavLink>
              </span>
            </CardPanel>
          </Col>
        </Row>
       {
//        <form onSubmit={this.handleSubmit}>
//           
//             <Row>
//               <Col s={12} l={6} offset-l={4} xl={4} offset-xl={4}>
//               <Input name="amount" type="text" pattern="[0-9.]+(\.[0-9][0-9]?)?" value={this.state.amount} required s={6}/>
//               <Col s={3}><Button node="text" large waves="light" className="red ibtn" onClick={this.clearText.bind(this)}>C</Button></Col>
//               <Col s={3}><Button node="text" large waves="light" className="yellow darken-2 ibtn" onClick={this.delText.bind(this)}>&#9003;</Button></Col>
//                 <div class="buttons">
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 1)}>1</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 2)}>2</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 3)}>3</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="yellow darken-2 ibtn" onClick={this.delText.bind(this)}>&#9003;</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 4)}>4</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 5)}>5</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 6)}>6</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="red ibtn" onClick={this.clearText.bind(this)}>C</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 7)}>7</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 8)}>8</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 9)}>9</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn">&equiv;</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, ".")}>.</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn" onClick={this.addText.bind(this, 0)}>0</Button></Col>
//                   <Col s={3}><Button node="text" large waves="light" className="ibtn">%</Button></Col>
//                   <Col s={3}><Button node="button" large waves="light" className="green ibtn">&#10003;</Button></Col>
//                 </div>
//               </Col>
//             </Row>
//           
//         </form>
        }
        </Container>
      </div>
    );
  }
}
 
export default Order;
