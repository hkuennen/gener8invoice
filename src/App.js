import React, { useState, useEffect } from "react";
import ContactInfo from "./components/ContactInfo";
import InvoicePositions from "./components/InvoicePositions";
import "./App.css";
import "./components/ContactInfo.css";
import "./components/InvoicePositions.css";

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

    const settings = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    }
    const fetchResponse = await fetch("/api/data", settings);
    const data = await fetchResponse.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(data);
    link.download = `Invoice No. ${inputs.inv_number}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  }

  const handleAddPosition = (e) => {
    e.preventDefault();
    const row = {
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: parseFloat(0).toFixed(2)
    };
    setPositions(rows => ([...rows, row]));
  }

  const handleRemovePosition = (e, idx) => {
    e.preventDefault();
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
          <div id="layout" className="page">
            <ContactInfo 
              inputs={inputs}
              handleInputsChange={handleInputsChange}
            />
            <br /><br /><br /><br /><br />
            <InvoicePositions 
              positions={positions}
              subtotal={subtotal}
              handlePositionsChange={handlePositionsChange}
              handleAddPosition={handleAddPosition}
              handleRemovePosition={handleRemovePosition}
            />
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