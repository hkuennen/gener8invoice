import React, { useState, useEffect } from "react";
import ContactInfo from "./components/ContactInfo";
import InvoicePositions from "./components/InvoicePositions";
import InvoiceSum from "./components/InvoiceSum";
import InvoicePositionsSecondPage from "./components/InvoicePositionsSecondPage";
import AccountDetails from "./components/AccountDetails";
import "./App.css";
import "./components/ContactInfo.css";

const App = () => {
  const [infos, setInfos] = useState({});
  const [positions, setPositions] = useState([{
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: parseFloat(0).toFixed(2)
    }]);
  const [array, setArray] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState("0.19");
  const maxRowsPerPage = 20;
  const maxRowsPerPageWithPagebreak = 25;

  const handleInfosChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInfos(values => ({...values, [name]: value}));
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
    let newArr = [...positions];
    let arr = [];
    if (newArr.length <= maxRowsPerPage) {
      for (let i = 0; i < newArr.length; i += maxRowsPerPage) {
        const row = newArr.slice(i, i + maxRowsPerPage);
        arr.push(row);
      }
    } else if (newArr.length > maxRowsPerPage) {
      for (let i = 0; i < newArr.length; i += maxRowsPerPageWithPagebreak) {
        const row = newArr.slice(i, i + maxRowsPerPageWithPagebreak);
        arr.push(row);
      }
    } 
    setArray(arr);
  }, [positions]);

  return (
    <div className="App">
      <header className="App-header"></header>
        <form onSubmit={handleSubmit}>
        <div className="wrapper">
          <div className="page">
            <ContactInfo 
              infos={infos}
              handleInfosChange={handleInfosChange}
            />
            <br />
            <InvoicePositions 
              positions={positions}
              maxRowsPerPage={maxRowsPerPage}
              array={array}
              handlePositionsChange={handlePositionsChange}
              handleAddPosition={handleAddPosition}
              handleRemovePosition={handleRemovePosition}
            />
            {positions.length <= maxRowsPerPageWithPagebreak && <button id="add" className="pointer" onClick={(e) => handleAddPosition(e)}>+</button>}
            {positions.length <= maxRowsPerPage && <>
              <InvoiceSum 
                subtotal={subtotal}
                tax={tax}
                handleTaxChange={handleTaxChange}
              />
            </>
            }
            <AccountDetails 
              infos={infos}
              handleInfosChange={handleInfosChange}
            />
          </div>
          {positions.length > maxRowsPerPage && positions.length <= maxRowsPerPageWithPagebreak && <div className="page">
            <InvoiceSum 
              subtotal={subtotal}
              tax={tax}
              handleTaxChange={handleTaxChange}
            />
            <AccountDetails 
              infos={infos}
              handleInfosChange={handleInfosChange}
            />
          </div>
          }
          {positions.length > maxRowsPerPageWithPagebreak && <div className="page">
            <InvoicePositionsSecondPage 
              array={array}
              maxRowsPerPageWithPagebreak={maxRowsPerPageWithPagebreak}
              handlePositionsChange={handlePositionsChange}
              handleRemovePosition={handleRemovePosition}
              handleAddPosition={handleAddPosition}
            />
            <button id="add" className="pointer" onClick={(e) => handleAddPosition(e)} disabled={positions.length >= 49}>+</button>
            <InvoiceSum 
              subtotal={subtotal}
              tax={tax}
              handleTaxChange={handleTaxChange}
            />
            <AccountDetails 
              infos={infos}
              handleInfosChange={handleInfosChange}
            />
          </div>
          }
          <div className="button">
            <input type="submit" value="Download PDF" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;