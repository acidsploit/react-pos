import React, { Component } from "react";
import Timestamp from "react-timestamp";
import {Icon} from 'react-materialize'

 
class Ledger extends Component {
  constructor(props) {
    super(props);
    this.state = {  server: localStorage.getItem('server'),
                    data: [],
                  };
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
        this.setState({data: data})
      })
  }
  
  render() {
    return (
      <div>
        <h3>Sales Ledger</h3>
        <table className="responsive-table striped">
          <thead>
            <tr>
                <th>#</th>
                <th>Date/Time</th>
                <th>Address</th>
                <th>Amount (BCH)</th>
                <th>Label</th>
                <th>Payment Received</th>
            </tr>
          </thead>

          <tbody>{this.state.data.reverse().map(function(item, key) {
            return (
              <tr key = {item.id}>
                <td>{item.id}</td>
                <td><Timestamp time={item.timestamp} format='full' includeDay /></td>
                <td><a target="_blank" href={"https://blockdozer.com/insight/address/" + item.addr}>{item.addr}</a></td>
                <td>{item.amount}</td>
                <td>{item.label}</td>
                <td>{item.received ? <Icon>check</Icon> : <Icon>clear</Icon>}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    );
  }
}
 
export default Ledger;
