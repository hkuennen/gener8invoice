import { useRef } from "react";

const ContactInfo = ({infos, handleInfosChange}) => {
  const refDate = useRef();

  return (
    <>
      <h1>{"Invoice".toUpperCase()}</h1>
      <div className="container">
        <div className="contact-info">
          <div className="sender">
            <p className="underline">
              {infos.biller_name || "Biller Name"}, {" "}
              {infos.biller_street || "Street"}, {" "}
              {infos.biller_location || "Postcode and Location"}
            </p>
          </div>
          <div>
            <input 
              type="text" 
              name="recipient_name" 
              placeholder="Recipient Name" 
              onChange={(e) => handleInfosChange(e)} 
              required 
            />
            <br />
            <input 
              type="text" 
              name="recipient_street" 
              placeholder="Street" 
              onChange={(e) => handleInfosChange(e)} 
              required 
            />
            <br />
            <input 
              type="text" 
              name="recipient_location" 
              placeholder="Postcode and Location" 
              onChange={(e) => handleInfosChange(e)} 
              required 
            />
          </div>
        </div>
        <div className="invoice-info">
          <input 
            type="text" 
            name="biller_name" 
            placeholder="Biller Name" 
            onChange={(e) => handleInfosChange(e)} 
            required 
          />
          <br />
          <input 
            type="text" 
            name="biller_street" 
            placeholder="Street" 
            onChange={(e) => handleInfosChange(e)} 
            required 
          />
          <br />
          <input 
            type="text" 
            name="biller_location" 
            placeholder="Postcode and Location" 
            onChange={(e) => handleInfosChange(e)} 
            required 
          />
          <br />
          <br />
          <input 
            type="text" 
            name="date" 
            ref={refDate} 
            placeholder="Date" 
            onFocus={() => {refDate.current.type = "date"}} 
            onChange={(e) => handleInfosChange(e)} 
            required 
          />
          <br />
          <input 
            type="text" 
            name="inv_number" 
            placeholder="Invoice Number" 
            onChange={(e) => handleInfosChange(e)} 
            required 
          />
          <br />
          <input 
            type="text" 
            name="po_number" 
            placeholder="PO Number (optional)" 
            onChange={(e) => handleInfosChange(e)}
          />
        </div>
      </div>
    </>
  );
}

export default ContactInfo;