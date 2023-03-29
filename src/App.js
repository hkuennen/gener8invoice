import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState({
    date: "",
    programming: "",
  });
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);

    const settings = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputs)
    }
    const fetchResponse = await fetch("/api/data", settings);
    const data = await fetchResponse.json();
    console.log(data);
  }

  const addPosition = () => {
    alert("button clicked");
  }

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
        <form onSubmit={handleSubmit}>
        <div className="wrapper">
          <div className="page">
                <h1>{"Invoice".toUpperCase()}</h1>
            <div className="two-col">
              <div className="contact-info">
                <div className="sender">
                  <p className="underline">{inputs.biller_name || "Biller Name"}, {inputs.biller_street || "Street"}, {inputs.biller_location || "Postcode and Location"}</p>
                </div>
                <div className="receiver">
                  <input type="text" name="recipient_name" placeholder="Recipient Name" onChange={handleChange}/><br />
                  <input type="text" name="recipient_street" placeholder="Street" onChange={handleChange}/><br />
                  <input type="text" name="recipient_location" placeholder="Postcode and Location" onChange={handleChange}/>
                </div>
              </div>
              <div className="invoice-info">
                <input type="text" name="biller_name" placeholder="Biller Name" onChange={handleChange}/><br />
                <input type="text" name="biller_street" placeholder="Street" onChange={handleChange}/><br />
                <input type="text" name="biller_location" placeholder="Postcode and Location" onChange={handleChange}/><br /><br />
                <input type="text" name="inv_number" placeholder="Invoice Number" onChange={handleChange}/><br />
                <input type="text" name="po_number" placeholder="PO Number" onChange={handleChange}/>
              </div>
            </div>
            <div className="right">
              <label className="bold">Date: </label>
              <input type="date" name="date" onChange={handleChange}/>
            </div>
            <br /><br /><br /><br /><br />
            <table>
              <tr className="grey">
                <th>Pos</th>
                <th>Qty</th>
                <th className="item">Item</th>
                <th>Unit price</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>1</td>
                <td><input type="number" name="qty" placeholder="1" className="number" onChange={handleChange} /></td>
                <td><input type="textarea" name="item" className="use-up-space" placeholder="Description of service or product..." onChange={handleChange}/></td>
                <td>
                  <label>€ </label>
                  <input type="number" name="price" placeholder="1" className="number" onChange={handleChange} />
                </td>
                <td className="amount">
                  <label>€ </label>
                  {isNaN(parseInt(inputs.qty)) || isNaN(parseInt(inputs.price)) ? (0).toFixed(2) : (inputs.qty * inputs.price).toFixed(2)}
                </td>
              </tr>
              <button id="add" onClick={addPosition}>+</button>
              <br />
              <tr className="grey">
                <td>Subtotal</td>
                <td></td>
                <td></td>
                <td></td>
                <td id="subtotal">€ 100</td>
              </tr>
              <br />
              <tr>
                <td>19% Tax</td>
                <td></td>
                <td></td>
                <td></td>
                <td>€ 19</td>
              </tr>
              <br />
              <tr className="bold">
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td id="total">€ 119</td>
              </tr>
            </table>
            <br /><br /><br /><br /><br />
            <p>{data.date}</p>
            <p>{data.programming}</p>
          </div>
          <input type="submit" value="Create PDF" />
        </div>
      </form>
    </div>
  );
}

export default App;