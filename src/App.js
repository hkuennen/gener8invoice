import React, { useState, useEffect } from "react";
import ContactInfo from "./components/ContactInfo";
import InvoicePositions from "./components/InvoicePositions";
import "./App.css";
import "./components/ContactInfo.css";
import "./components/InvoicePositions.css";

const App = () => {
  const [infos, setInfos] = useState({});
  const [positions, setPositions] = useState([{
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: parseFloat(0).toFixed(2)
    }]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState("0.19");

  const handleInfosChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInfos(values => ({...values, [name]: value}))
  }

  const handlePositionsChange = (e, idx) => {
    const name = e.target.name;
    const value = e.target.value;
    let newArr = [...positions];
    newArr[idx]["pos"] = idx+1
    newArr[idx][name] = value;

    const { qty, price } = newArr[idx];
    if (newArr[idx]["qty"] !== undefined && newArr[idx]["qty"].length !== 0) { newArr[idx]["qty"] = qty };
    if (newArr[idx]["price"] !== undefined && newArr[idx]["price"].length !== 0) { newArr[idx]["price"] = price };

    const q = parseInt(newArr[idx]["qty"]);
    const p = parseFloat(newArr[idx]["price"]).toFixed(2);
    const amount = (isNaN(q) || isNaN((p))) ? 0 : (qty * price);
    newArr[idx]["amount"] = amount;
    setPositions(newArr);
  }

  const handleTaxChange = (e) => {
    e.preventDefault();
    setTax(e.target.value);
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
    setPositions((rows) => ([...rows, row]));
  }

  const handleRemovePosition = (e, idx) => {
    e.preventDefault();
    const rows = [...positions];
    rows.splice(idx, 1);
    setPositions(() => rows);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = {
      infos,
      positions,
      tax: parseInt(parseFloat(tax) * 100),
      amount: {
        subtotal,
        tax: (subtotal * parseFloat(tax)).toFixed(2),
        total: (subtotal * (1 + parseFloat(tax))).toFixed(2)
      }
    };
    console.log(values.amount.total);
    const settings = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    };
    try {
      const response = await fetch("/api/data", settings);
      const data = await response.blob();
      const link = document.createElement('a');
      
      link.href = URL.createObjectURL(data);
      link.download = `Invoice No. ${infos.inv_number}.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 2000);
    } catch (error) {
      alert("Error", error);
    }
  }

  useEffect(() => {
    const calcSubtotal = () => {
      const amounts = [];
      positions.forEach((position) => {
        amounts.push(position.amount);
      })
      return amounts.reduce((prevValue, currentValue) => prevValue + currentValue, 0);
    }
    setSubtotal(() => calcSubtotal());
  }, [positions]);

  return (
    <div className="App">
      <header className="App-header"></header>
        <form onSubmit={handleSubmit}>
        <div className="wrapper">
          <div id="layout" className="page">
            <ContactInfo 
              infos={infos}
              handleInfosChange={handleInfosChange}
            />
            <br /><br /><br />
            <InvoicePositions 
              positions={positions}
              subtotal={subtotal}
              tax={tax}
              handlePositionsChange={handlePositionsChange}
              handleTaxChange={handleTaxChange}
              handleAddPosition={handleAddPosition}
              handleRemovePosition={handleRemovePosition}
            />
          </div>
          <div className="button">
            <input type="submit" value="Generate PDF" id="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;