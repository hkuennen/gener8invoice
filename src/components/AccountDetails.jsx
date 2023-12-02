const AccountDetails = ({infos, handleInfosChange}) => {
  return (
    <>
      <div className="account-details">
        <div className="account-holder">
          <input type="text" name="acc_holder" value={infos.acc_holder || null} placeholder="Account holder (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
          <input type="text" name="bank_name" value={infos.bank_name || null} placeholder="Bank name (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
        </div>
        <div className="account-number">
          <input type="text" name="iban" value={infos.iban || null} placeholder="IBAN (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
          <input type="text" name="bic" value={ infos.bic || null} placeholder="BIC (optional)" size="50" onChange={(e) => handleInfosChange(e)} /><br />
        </div>
      </div>
    </>
  )
}

export default AccountDetails;