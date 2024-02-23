import React, { useState, useEffect } from "react";
import ContactInfo from "./components/ContactInfo";
import InvoicePositionsFirstPage from "./components/InvoicePositionsFirstPage";
import InvoicePositionsOtherPages from "./components/InvoicePositionsOtherPages";
import InvoiceSum from "./components/InvoiceSum";
import AccountDetails from "./components/AccountDetails";
import sendPostRequestAndDownloadFile from "./utils/PostRequest";
import calcArrayForPageBreak from "./utils/PageBreak";
import calcArrayForPositionChange from "./utils/PositionChange";
import calcSubtotal from "./utils/Subtotal";
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
    const arr = calcArrayForPositionChange(positions, idx, name, value);
    setPositions(arr);
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

  const handleSubmit = (e) => {
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
    sendPostRequestAndDownloadFile(values);
  }

  useEffect(() => {
    const subtotal = calcSubtotal(positions);
    setSubtotal(() => subtotal);
    const arr = calcArrayForPageBreak(positions, maxRowsPerPage, maxRowsPerPageWithPagebreak);
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