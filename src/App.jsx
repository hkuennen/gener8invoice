import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

import ContactInfo from "./components/ContactInfo";
import InvoiceSum from "./components/InvoiceSum";
import AccountDetails from "./components/AccountDetails";
import PageBuilder from "./components/PageBuilder";

import sendPostRequestAndDownloadFile from "./utils/postRequest";
import PositionManager from "./utils/PositionManager";
import {
  MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION,
  MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION,
  MAX_ROWS_PER_OTHER_PAGES_BEFORE_PAGINATION,
  MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION
} from "./utils/constants";
import "./App.scss";

const App = () => {
  const [infos, setInfos] = useState({});
  const [positions, setPositions] = useState([
    {
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: parseFloat(0).toFixed(2)
    }
  ]);
  const [positionsPerPage, setPositionsPerPage] = useState([positions]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState("0.19");

  useEffect(() => {
    fetch("/api/csrf/")
      .then((response) => response.json())
      .then((data) => {
        Cookies.set("csrftoken", data.csrfToken, { sameSite: "None" });
      })
      .catch((error) => console.error("error:", error));
  }, []);

  const formatIban = (value) => {
    const rawIban = value.replace(/\W/gi, "");
    return rawIban.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleInfosChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "iban") {
      value = formatIban(value);
    }
    setInfos((values) => ({ ...values, [name]: value }));
  };

  const handlePositionsChange = (e, idx) => {
    const name = e.target.name;
    const value = e.target.value;
    const manager = new PositionManager(positions);
    const newPosition = manager.calcNewPosition({ idx, name, value });
    setPositions(newPosition);
  };

  const handleTaxChange = (e) => {
    e.preventDefault();
    setTax(e.target.value);
  };

  const handleAddPosition = (e) => {
    e.preventDefault();
    const row = {
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: parseFloat(0).toFixed(2)
    };
    setPositions((rows) => [...rows, row]);
  };

  const handleRemovePosition = (e, idx) => {
    e.preventDefault();
    const rows = [...positions];
    rows.splice(idx, 1);
    setPositions(() => rows);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      infos,
      positions,
      maxPositionsPerPage: {
        firstPageBeforePagination: MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION,
        firstPageAfterPagination: MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION,
        otherPagesBeforePagination: MAX_ROWS_PER_OTHER_PAGES_BEFORE_PAGINATION,
        otherPagesAfterPagination: MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION
      },
      tax: parseInt(parseFloat(tax) * 100),
      amount: {
        subtotal,
        tax: (subtotal * parseFloat(tax)).toFixed(2),
        total: (subtotal * (1 + parseFloat(tax))).toFixed(2)
      }
    };
    sendPostRequestAndDownloadFile(values);
  };

  useEffect(() => {
    const manager = new PositionManager(positions);
    const subtotal = manager.calcSubtotal(positions);
    const paginatedPositions = manager.paginate();
    setSubtotal(() => subtotal);
    setPositionsPerPage(paginatedPositions);
  }, [positions]);

  const contactInfo = <ContactInfo infos={infos} handleInfosChange={handleInfosChange} />;

  const invoiceSum = <InvoiceSum subtotal={subtotal} tax={tax} handleTaxChange={handleTaxChange} />;

  const accountDetails = <AccountDetails infos={infos} handleInfosChange={handleInfosChange} />;

  const pageBuilder = (
    <PageBuilder
      positionsPerPage={positionsPerPage}
      handleAddPosition={handleAddPosition}
      handlePositionsChange={handlePositionsChange}
      handleRemovePosition={handleRemovePosition}
      contactInfo={contactInfo}
      invoiceSum={invoiceSum}
      accountDetails={accountDetails}
    />
  );

  return (
    <div className="App">
      <header className="App-header"></header>
      <form onSubmit={handleSubmit}>
        <div className="wrapper">
          {pageBuilder}
          <div className="button">
            <input type="submit" className="pointer" value="Download PDF" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default App;
