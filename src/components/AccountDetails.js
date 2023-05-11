const AccountDetails = ({handleInfosChange}) => {
  return (
    <div className="account-details">
      <div className="account-holder">
        <input type="text" name="acc-holder" placeholder="Account holder (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
        <input type="text" name="bank-name" placeholder="Bank name (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
      </div>
      <div className="account-number">
        <input type="text" name="iban" placeholder="IBAN (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
        <input type="text" name="bic" placeholder="BIC (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
      </div>
    </div>
  )
}

export default AccountDetails;