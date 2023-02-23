import React, { useState, useEffect } from "react";
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
      <header className="App-header">
        <div class="dinA4">
          <h1>{"Invoice".toUpperCase()}</h1>
          <p class="underline">Biller name, Street, Postcode and Location</p>
          <p>Invoice recipient</p>
          <p>Street</p>
          <p>Postcode and Location</p>
          <p>Invoice number</p>
          <p>Date</p>
          <br /><br />
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
      </header>
    </div>
  );
}

export default App;