from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def create_pdf(data):
  buffer = BytesIO()
  doc = SimpleDocTemplate(buffer, pagesize=A4,
                      rightMargin=1.6*cm, leftMargin=1.6*cm,
                      topMargin=1.6*cm, bottomMargin=1.6*cm
                      )
  
  Story = []

  pdfmetrics.registerFont(TTFont('CMU Bright', 'cmunbmr.ttf'))
  pdfmetrics.registerFont(TTFont('CMU Bright SemiBold', 'cmunbsr.ttf'))
  s = Spacer(1,30)

  header = "INVOICE"

  style = getSampleStyleSheet()
  h_style = ParagraphStyle('header',
                          fontName="CMU Bright SemiBold",
                          fontSize=16,
                          parent=style['Normal'],
                          )
  
  p1 = Paragraph(header, h_style)
  Story.append(p1)

  Story.append(s)

  biller = f"""{data['inputs']['biller_name']}\n
  {data['inputs']['biller_street']}\n
  {data['inputs']['biller_location']}\n
  \n
  {data['inputs']['inv_number']}\n
  {data['inputs']['po_number']}\n
  """

  b_style = ParagraphStyle('biller',
                          fontName="CMU Bright",
                          fontSize=10,
                          parent=style['Normal'],
                          alignment=0,
                          leading=7,
                          borderPadding=0,
                          leftIndent=13.5*cm,
                          rightIndent=0,
                          spaceAfter=0,
                          spaceBefore=0,
                          splitLongWords=1,
                          spaceShrinkage=0.05,
                          wordWrap = "LTR",
                          allowWidows=1
                          )
  p2 = Paragraph(biller.replace("\n", "<br />"), b_style)
  Story.append(p2)

  Story.append(s)

  recipient = f"""{data['inputs']['recipient_name']}\n
  {data['inputs']['recipient_street']}\n
  {data['inputs']['recipient_location']}\n
  """

  r_style = ParagraphStyle('recipient',
                          parent=b_style,
                          alignment=4,
                          borderPadding=0,
                          leftIndent=0
                          )
  p3 = Paragraph(recipient.replace("\n", "<br />"), r_style)
  Story.append(p3)

  Story.append(s)

  date = f"Date: {data['inputs']['date']}"

  d_style = ParagraphStyle('date',
                          fontName="CMU Bright SemiBold",
                          parent=b_style,
                          leftIndent=14.5*cm
                          )
  p4 = Paragraph(date, d_style)
  Story.append(p4)

  doc.build(Story)

  print("PDF created successfully")
  return buffer
