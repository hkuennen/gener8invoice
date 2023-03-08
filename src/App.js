import React, { useState, useEffect } from "react";
import moment from "moment";
import './App.css';

function App() {
  const [data, setData] = useState({
    date: "",
    programming: "",
  });

useEffect(() => {
  fetch('/api/data')
    .then((res) => res.json())
    .then((data) => {
      setData({
        date: data.Date,
        programming: data.programming,
      });
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="wrapper">
        <div class="page">
              <h1>{"Invoice".toUpperCase()}</h1>
          <div className="two-col">
            <div className="contact-info">
              <div className="sender">
                <p className="underline">Biller name, Street, Postcode and Location</p>
              </div>
              <div className="receiver">
                <p>Invoice recipient</p>
                <p>Street</p>
                <p>Postcode and Location</p>
              </div>
            </div>
            <div className="invoice-info">
            </div>
          </div>
          <p class="right">Date: {moment().format('L')}</p>
          <p class="left bold inv-number">Invoice number: </p>
          <br /><br /><br /><br />
          <p>Pos</p>
          <p>Qty</p>
          <p>Item</p>
          <p>Unit price</p>
          <p>Amount</p>
          <p>Subtotal</p>
          <p>Tax</p>
          <p>Total</p>
          <p>{data.date}</p>
          <p>{data.programming}</p>
        </div>
      </div>
    </div>
  );
}

export default App;