import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState({
    date: "",
    programming: "",
  });
  const [inputs, setInputs] = useState({});
  const [positions, setPositions] = useState([{
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: parseFloat(0).toFixed(2)
    }]);
  const [subtotal, setSubtotal] = useState(0);

  const handleInputsChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handlePositionsChange = (e, idx) => {
    const name = e.target.name;
    const value = e.target.value;
    let newArr = [...positions];
    newArr[idx]["pos"] = idx+1
    newArr[idx][name] = value;
    const { qty, price } = newArr[idx];
    
    if (newArr[idx]["qty"] !== undefined && newArr[idx]["qty"] !== "") { newArr[idx]["qty"] = qty };
    if (newArr[idx]["price"] !== undefined && newArr[idx]["price"] !== "") { newArr[idx]["price"] = price };
    
    const q = parseInt(newArr[idx]["qty"]);
    const p = parseFloat(newArr[idx]["price"]).toFixed(2);
    const amount = (isNaN(q) || isNaN((p))) ? 0 : (qty * price);
    newArr[idx]["amount"] = amount;
    setPositions(newArr);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = {
      inputs,
      positions,
      amount: {
        subtotal,
        tax: (subtotal * 0.19),
        total: (subtotal * 1.19)
      }
    };

    console.log(values);
    // const settings = {
    //   method: "POST",
    //   headers: {
    //     "Accept": "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(inputs)
    // }
    // const fetchResponse = await fetch("/api/data", settings);
    // const data = await fetchResponse.json();
    // console.log(data);
  }

  const handleAddPosition = () => {
    const row = {
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: parseFloat(0).toFixed(2)
    };
    setPositions(rows => ([...rows, row]));
  }

  const handleRemovePosition = (idx) => {
    const rows = [...positions];
    rows.splice(idx, 1);
    setPositions(() => rows);
  }

  useEffect(() => {
    const calcSubtotal = () => {
      const amounts = [];
      positions.forEach((position) => {
        amounts.push(parseInt(position.amount));
      })
      return amounts.reduce((prevValue, currentValue) => prevValue + currentValue, 0);
    }
    setSubtotal(() => calcSubtotal());
  }, [positions]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchResponse = await fetch('/api/data');
      const data = await fetchResponse.json();
      setData({
        date: data.Date,
        programming: data.programming,
      });
    }
    fetchData()
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
                  <input type="text" name="recipient_name" placeholder="Recipient Name" onChange={(e) => handleInputsChange(e)}/><br />
                  <input type="text" name="recipient_street" placeholder="Street" onChange={(e) => handleInputsChange(e)}/><br />
                  <input type="text" name="recipient_location" placeholder="Postcode and Location" onChange={(e) => handleInputsChange(e)}/>
                </div>
              </div>
              <div className="invoice-info">
                <input type="text" name="biller_name" placeholder="Biller Name" onChange={(e) => handleInputsChange(e)}/><br />
                <input type="text" name="biller_street" placeholder="Street" onChange={(e) => handleInputsChange(e)}/><br />
                <input type="text" name="biller_location" placeholder="Postcode and Location" onChange={(e) => handleInputsChange(e)}/><br /><br />
                <input type="text" name="inv_number" placeholder="Invoice Number" onChange={(e) => handleInputsChange(e)}/><br />
                <input type="text" name="po_number" placeholder="PO Number" onChange={(e) => handleInputsChange(e)}/>
              </div>
            </div>
            <div className="right">
              <label className="bold">Date: </label>
              <input type="date" name="date" onChange={(e) => handleInputsChange(e)}/>
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
              {positions.map((row, idx) => (
              <tr key={idx+1}>
                <td>{idx+1}</td>
                <td><input type="number" name="qty" placeholder="1" className="number" value={row.qty} onChange={(e) => handlePositionsChange(e, idx)} /></td>
                <td><input type="textarea" name="item" className="use-up-space" placeholder="Description of service or product..." value={row.item} onChange={(e) => handlePositionsChange(e, idx)}/></td>
                <td>
                  <label>€ </label>
                  <input type="number" step="0.01" name="price" placeholder="0.00" className="number" value={row.price} onBlur={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} onChange={(e) => handlePositionsChange(e, idx)} />
                </td>
                <td className="amount">
                  <label>€ </label>
                  {parseFloat(row.amount).toFixed(2)}
                </td>
                <td>
                  <button onClick={() => handleRemovePosition(idx)}>X</button>
                </td>
              </tr>
              ))}
              <button id="add" onClick={handleAddPosition}>+</button>
              <br />
              <tr className="grey">
                <td>Subtotal</td>
                <td></td>
                <td></td>
                <td></td>
                <td id="subtotal">€ {isNaN(subtotal) ? (0).toFixed(2) : subtotal.toFixed(2)}</td>
              </tr>
              <br />
              <tr>
                <td>19% Tax</td>
                <td></td>
                <td></td>
                <td></td>
                <td>€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * 0.19).toFixed(2)}</td>
              </tr>
              <br />
              <tr className="bold">
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td id="total">€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * 1.19).toFixed(2)}</td>
              </tr>
            </table>
            <br /><br /><br /><br /><br />
            <p>{data.date}</p>
            <p>{data.programming}</p>
          </div>
          <input type="submit" value="Create PDF" className="right" />
        </div>
      </form>
    </div>
  );
}

export default App;