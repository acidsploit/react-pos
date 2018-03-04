 
                <ul className="collection">
                  {this.state.items.map((item, key) => {
                    return (
                      <li className="collection-item avatar order-items" key={key}>
                        
                        <i className={"material-icons circle large " + this.getColor(item.id - 1)}>forward</i>
                                                
                        <span className="title left"><b>{item.id} - {item.name}</b></span>
                        <span className="title right">{parseFloat(item.bch * this.state.exchangeRate).toFixed(2)} {this.state.currency}</span><br />
                        <span className="title left">{parseFloat(item.timestamp).toFixed(0)}</span>
                        <span className="title right">{item.bch} BCH</span>
                        
                        <i className="fixed-action-btn horizontal secondary-content">
                          <i className="btn-floating btn-large red ">
                            <i className="material-icons">menu</i>
                          </i>
                          <ul>
                            <li><Button floating waves='light' className="red" onClick={this.handleDelete.bind(this, key)}><Icon>remove_shopping_cart</Icon></Button></li>
                            <li><Button floating waves='light' className="green" onClick={this.handleDelete.bind(this, key)}><Icon>add</Icon></Button></li>
                          </ul>
                        </i>
                        
                        {
                        //<Button large waves='light' className="secondary-content red btn-item-remove" onClick={this.handleDelete.bind(this, key)}><Icon>remove_shopping_cart</Icon></Button>
                        }
                      </li>
                    )
                  })}
                </ul>
                
                
                
                <Col s={12} className="order-items">
                {this.state.items.map((item, key) => {
                  return (
                  <Row>
                    <Col s={1} className="order-item">
                      <i className={"material-icons circle large " + this.getColor(item.id - 1)}>forward</i>
                    </Col>
                  <Row>
                  );
                }
                </Col>
                
                
                
                
                
                
            <ul className="collection">
              {this.state.items.map((item, key) => {
                return (
                  <li className="collection-item avatar" key={key}>
                    <i className={"material-icons circle large " + this.getColor(key)}>forward</i>
                    <span className="left"><b>Item {key+1}</b></span>
                    <span className="right"><b>{parseFloat(item.bch * item.exchangeRATE).toFixed(2)} {item.currency}</b></span><br />
                    <span className="left">Description: Item {key+1}.</span>
                    <span className="right">{item.bch} BCH</span><br />
                    <span className="left"><Timestamp time={item.timestamp} format='full' includeDay /></span>
                  </li>
                )
              })}
            </ul>
