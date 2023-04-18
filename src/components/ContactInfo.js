const ContactInfo = ({inputs, handleInputsChange}) => {
  return (
    <>
      <h1>{"Invoice".toUpperCase()}</h1>
      <div className="two-col">
        <div className="contact-info">
          <div className="sender">
            <p className="underline">{inputs.biller_name || "Biller Name"}, {inputs.biller_street || "Street"}, {inputs.biller_location || "Postcode and Location"}</p>
          </div>
          <div>
            <input type="text" name="recipient_name" placeholder="Recipient Name" onChange={(e) => handleInputsChange(e)} required /><br />
            <input type="text" name="recipient_street" placeholder="Street" onChange={(e) => handleInputsChange(e)} required /><br />
            <input type="text" name="recipient_location" placeholder="Postcode and Location" onChange={(e) => handleInputsChange(e)} required />
          </div>
        </div>
        <div className="invoice-info">
          <input type="text" name="biller_name" placeholder="Biller Name" onChange={(e) => handleInputsChange(e)} required /><br />
          <input type="text" name="biller_street" placeholder="Street" onChange={(e) => handleInputsChange(e)} required /><br />
          <input type="text" name="biller_location" placeholder="Postcode and Location" onChange={(e) => handleInputsChange(e)} required /><br /><br />
          <input type="text" name="inv_number" placeholder="Invoice Number" onChange={(e) => handleInputsChange(e)} required /><br />
          <input type="text" name="po_number" placeholder="PO Number" onChange={(e) => handleInputsChange(e)}/>
        </div>
      </div>
      <div className="right">
        <label className="bold">Date: </label>
        <input type="date" name="date" onChange={(e) => handleInputsChange(e)} required />
      </div>
    </>
  );
}

export default ContactInfo;