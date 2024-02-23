import React, { useState, useEffect } from "react";
import ContactInfo from "./components/ContactInfo";
import InvoicePositionsFirstPage from "./components/InvoicePositionsFirstPage";
import InvoicePositionsOtherPages from "./components/InvoicePositionsOtherPages";
import InvoiceSum from "./components/InvoiceSum";
import AccountDetails from "./components/AccountDetails";
import "./App.css";

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
    const request = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    };
    try {
      const response = await fetch("/api/data", request);
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
      const amounts = positions.map((position) => position.amount);
      return amounts.reduce((sum, amount) => sum + amount, 0);
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

  const contactInfo = (
    <ContactInfo 
      infos={infos}
      handleInfosChange={handleInfosChange}
    />
  );

  const invoicePositionsFirstPage = (
    <InvoicePositionsFirstPage 
      positions={positions}
      maxRowsPerPage={maxRowsPerPage}
      array={array}
      handlePositionsChange={handlePositionsChange}
      handleRemovePosition={handleRemovePosition}
    />
  );

  const invoicePositionsOtherPages = (
    <InvoicePositionsOtherPages
      maxRowsPerPageWithPagebreak={maxRowsPerPageWithPagebreak}
      array={array}
      handlePositionsChange={handlePositionsChange}
      handleRemovePosition={handleRemovePosition}
    />
  );

  const invoiceSum = (
    <InvoiceSum 
      subtotal={subtotal}
      tax={tax}
      handleTaxChange={handleTaxChange}
    />
  );

  const accountDetails = (
    <AccountDetails 
      infos={infos}
      handleInfosChange={handleInfosChange}
    />
  );

  const addButton = (
      <button className="add pointer" onClick={(e) => handleAddPosition(e)} disabled={positions.length >= 49}>+</button>
    );

  const firstPage = (
    <div className="page">
      {contactInfo}
      <br />
      {invoicePositionsFirstPage}
      {positions.length <= maxRowsPerPageWithPagebreak && addButton}
      {positions.length <= maxRowsPerPage && invoiceSum}
      {accountDetails}
    </div>
  );

  const pagebreak = (
    <div className="page">
      {invoiceSum}
      {accountDetails}
    </div>
  );

  const otherPages = (
    <div className="page">
      {invoicePositionsOtherPages}
      {addButton}
      {invoiceSum}
      {accountDetails}
    </div>
  );

  return (
    <div className="App">
      <header className="App-header"></header>
        <form onSubmit={handleSubmit}>
        <div className="wrapper">
          {firstPage}
          {positions.length > maxRowsPerPage && positions.length <= maxRowsPerPageWithPagebreak && 
          pagebreak}
          {positions.length > maxRowsPerPageWithPagebreak && 
          otherPages}
          <div className="button">
            <input type="submit" className="pointer" value="Download PDF" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;