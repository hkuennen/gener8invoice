const AccountDetails = ({handleInfosChange}) => {
  return (
    <div className="account-details">
      <div className="account-holder">
        <input type="text" name="acc-holder" placeholder="Account holder" size="50" onChange={(e) => handleInfosChange(e)} required /><br />
        <input type="text" name="bank-name" placeholder="Bank name" size="50" onChange={(e) => handleInfosChange(e)} required /><br />
      </div>
      <div className="account-number">
        <input type="text" name="iban" placeholder="IBAN" size="50" onChange={(e) => handleInfosChange(e)} required /><br />
        <input type="text" name="bic" placeholder="BIC" size="50" onChange={(e) => handleInfosChange(e)} required /><br />
      </div>
    </div>
  )
}

export default AccountDetails;