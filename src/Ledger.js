import React, { Component } from "react";
import Timestamp from "react-timestamp";
import {Button, Icon} from 'react-materialize';
// import Pagination from 'react-materialize';
import OrderListing from "./OrderListing";
import PingPong from './PingPong';
 
class Ledger extends Component {
  constructor(props) {
    super(props);
    this.state = {  server: localStorage.getItem('server'),
                    data: [],
                    order: 0,
                  };
                  
    this.handleOrder = this.handleOrder.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);

  }
  
  componentDidMount() {
    var query = this.state.server + "/api/ledger"
    
    fetch(query)
      .then(results => results.json())
      .then(json => {
//         console.log(json)
        let data = []
        for(let payment in json){
          data.push(json[payment])
//           console.log(json[payment])
        }
        data = data.reverse()
        this.setState({data: data})
      })
  }
  
  handleOrder(label, tx, event){
    event.preventDefault()
    
    this.setState({ order: 1,
                    label: label,
                    tx: tx,
    })
  }
  
  handleClose(event){
    event.preventDefault()
    
    this.setState({ order: 0,
                    label: "",
    })
  }
  
  handlePrev(event){
    event.preventDefault()
    let current = this.state.data.findIndex( payment => payment.label === this.state.label );
    current++
    console.log(current)
    for (current; current < this.state.data.length; current++){
      if (this.state.data[current]['order'] === 1){
        console.log(this.state.data[current]['label'])
        this.setState({ label: this.state.data[current]['label'],
                        tx: this.state.data[current]['txid'],
        })
        break;
      }
    }
    
  }
  
  handleNext(event){
    event.preventDefault()
    let current = this.state.data.findIndex( payment => payment.label === this.state.label );
    current--
    console.log(current)
    for (current; current >= 0; current--){
      if (this.state.data[current]['order'] === 1){
        console.log(this.state.data[current]['label'])
        this.setState({ label: this.state.data[current]['label'],
                        tx: this.state.data[current]['txid'],
        })
        break;
      }
    }
    
  }
  
  render() {
    if (!this.state.order) {
      return (
        <div>
          <h3>Sales Ledger</h3>
          
          {
            //<Pagination items={10} activePage={2} maxButtons={8} />
          }
          <table className="responsive-table striped">
            <thead>
              <tr>
                  <th>#</th>
                  <th>Date/Time</th>
                  <th>Address</th>
                  <th>Amount (BCH)</th>
                  <th>Label</th>
                  <th>Paid?</th>
                  <th>Order</th>
              </tr>
            </thead>

            <tbody>{this.state.data.map((item, key) => {
              return (
                <tr key = {key}>
                  <td>{item.id}</td>
                  <td><Timestamp time={item.timestamp} format='full' includeDay /></td>
                  <td><a target="_blank" href={"https://blockdozer.com/insight/address/" + item.addr}>{item.addr.slice(0,18) + "..." + item.addr.slice(-7,-1)}</a></td>
                  <td>{item.amount}</td>
                  <td>{item.label}</td>
                  {
                  //<td>{item.received ? <a target="_blank" href={"https://blockdozer.com/insight/tx/" + item.txid}><Icon className="green-text">check</Icon></a> : <Icon className="red-text">clear</Icon>}</td>
                  }
                  <td>{item.received ? <Button waves='light' className='grey lighten-2' node='a' target='_blank' href={"https://blockdozer.com/insight/tx/" + item.txid}><Icon className="green-text">check</Icon></Button> : <Icon className="red-text">clear</Icon>}</td>
                  <td>{item.order ? <Button waves='light' className='grey lighten-2' onClick={this.handleOrder.bind(this, item.label, item.txid)}><Icon className="green-text">check</Icon></Button> : <Icon className="red-text">clear</Icon>}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
          <PingPong />
        </div>
      );
    } else {
      return(
        <div>
          <div className='close'>
            <Button waves="light" className="right red btn-close" onClick={this.handleClose.bind(this)}><Icon className="icon-close" left>clear</Icon></Button>
          </div>
          <h3>Order: {this.state.label}</h3>
          <div className='backandforth'>
            <Button waves="light" className="light-blue darken-4 btn-backandforth  bold-big" onClick={this.handlePrev.bind(this)}><Icon left>keyboard_arrow_left</Icon>Prev</Button>
            <Button waves="light" className="light-blue darken-4 btn-backandforth bold-big" onClick={this.handleNext.bind(this)}><Icon right>keyboard_arrow_right</Icon>Next</Button>
          </div>
          
          <OrderListing label={this.state.label} tx={this.state.tx} />
          <PingPong />
        </div>
      )
    }
  }
}
 
export default Ledger;
