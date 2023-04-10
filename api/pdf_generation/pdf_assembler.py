from PyPDF2 import PdfFileWriter, PdfFileReader
import locale

locale.setlocale(locale.LC_TIME, 'en_US.utf-8')

def pdf_func(data):
    text_pdf = PdfFileReader(open("PDFs/Cover_Letter_Text.pdf", "rb"))
    # address_pdf = PdfFileReader(open("PDFs/Cover_Letter_Address.pdf", "rb"))
    # date_pdf = PdfFileReader(open("PDFs/Cover_Letter_Date.pdf", "rb"))
    # salutation_pdf = PdfFileReader(open("PDFs/Cover_Letter_Salutation.pdf", "rb"))
    # existing_pdf = PdfFileReader(open("PDFs/Cover_Letter_blank.pdf", "rb"))
    output = PdfFileWriter()
    page = text_pdf.getPage(0)
    # page.mergePage(text_pdf.getPage(0))
    # page.mergePage(address_pdf.getPage(0))
    # page.mergePage(date_pdf.getPage(0))
    # page.mergePage(salutation_pdf.getPage(0))
    output.addPage(page)
    outputStream = open(f"{'Invoice_'}{'.pdf'}", 'wb')
    output.write(outputStream)
    outputStream.close()
    print("PDF created successfully")
