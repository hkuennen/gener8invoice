from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def create_pdf(data):
  doc = SimpleDocTemplate(f"Invoice No. {data['inputs']['inv_number']}.pdf",pagesize=A4,
                      rightMargin=1*cm, leftMargin=1*cm,
                      topMargin=1*cm, bottomMargin=1*cm
                      )
  
  Story = []

  biller = f"""{data['inputs']['biller_name']}\n
  {data['inputs']['biller_street']}\n
  {data['inputs']['biller_location']}\n
  {data['inputs']['inv_number']}\n
  {data['inputs']['po_number']}\n
  """

  pdfmetrics.registerFont(TTFont('Roboto', 'Roboto-Regular.ttf'))
  style = getSampleStyleSheet()
  bStyle = ParagraphStyle('title',
                          fontName="Roboto",
                          fontSize=9,
                          parent=style['Normal'],
                          alignment=2,
                          leading=6,
                          borderPadding=0,
                          leftIndent=0,
                          rightIndent=0,
                          spaceAfter=0,
                          spaceBefore=0,
                          splitLongWords=1,
                          spaceShrinkage=0.05,
                          wordWrap = "LTR",
                          allowWidows=1
                          )
  p1 = Paragraph(biller.replace("\n", "<br />"), bStyle)
  Story.append(p1)

  s = Spacer(1,20)
  Story.append(s)

  recipient = f"""{data['inputs']['recipient_name']}\n
  {data['inputs']['recipient_street']}\n
  {data['inputs']['recipient_location']}\n
  """

  rStyle = ParagraphStyle('title',
                          fontName="Roboto",
                          fontSize=9,
                          parent=style['Normal'],
                          alignment=4,
                          leading=6,
                          borderPadding=0,
                          leftIndent=0,
                          rightIndent=0,
                          spaceAfter=0,
                          spaceBefore=0,
                          splitLongWords=1,
                          spaceShrinkage=0.05,
                          wordWrap = "LTR",
                          allowWidows=1
                          )
  p2 = Paragraph(recipient.replace("\n", "<br />"), rStyle)
  Story.append(p2)

  doc.build(Story)

  print("PDF created successfully")
