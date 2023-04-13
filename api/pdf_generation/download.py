from PyPDF2 import PdfWriter, PdfReader
import locale

locale.setlocale(locale.LC_TIME, 'en_US.utf-8')

def download_pdf(inv_number):
    pdf = PdfReader(open("Invoice.pdf", "rb"))
    output = PdfWriter()
    page = pdf.pages[0]
    output.add_page(page)
    outputStream = open(f"Invoice No_{inv_number}.pdf", 'wb')
    output.write(outputStream)
    outputStream.close()
    print("PDF created successfully")
