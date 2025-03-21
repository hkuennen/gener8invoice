import Cookies from "js-cookie";

const sendPostRequestAndDownloadFile = async (values) => {
  const csrftoken = Cookies.get("csrftoken");
  const options = {
    method: "POST",
    headers: {
      Accept: "Accept: application/xhtml+xml",
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken
    },
    body: JSON.stringify(values)
  };
  try {
    const response = await fetch("/api/data/", options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.blob();
    const link = document.createElement("a");

    link.href = URL.createObjectURL(data);
    link.download = `Invoice No. ${values.infos.inv_number}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  } catch (error) {
    alert("Error", error);
  }
};

export default sendPostRequestAndDownloadFile;
