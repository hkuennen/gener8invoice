import datetime
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
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

  pdfmetrics.registerFont(TTFont('CMU Bright', 'pdf_generation/fonts/cmunbmr.ttf'))
  pdfmetrics.registerFont(TTFont('CMU Bright SemiBold', 'pdf_generation/fonts/cmunbsr.ttf'))

  s = Spacer(1,90)


  header = "INVOICE"

  style = getSampleStyleSheet()
  h_style = ParagraphStyle('header',
                          fontName="CMU Bright SemiBold",
                          fontSize=16,
                          parent=style['Normal'],
                          )
  
  p1 = Paragraph(header, h_style)
  Story.append(p1)

  biller_address = f"""\n
  \n
  \n
  \n
  <u>{data['infos']['biller_name']}, {data['infos']['biller_street']}, {data['infos']['biller_location']}</u>
  """

  ba_style = ParagraphStyle('biller_address',
                        fontName="CMU Bright",
                        fontSize=8,
                        parent=style['Normal'],
                        alignment=0
                        )
    
  def check_for_existence(key_or_value, name, name_on_pdf=None):
    if data['infos'].get(name) == None or len(data['infos'][name]) == 0:
      return '\n'
    elif key_or_value == "key":
      return name_on_pdf + '\n'
    else:
      return data['infos'][name] + '\n'

  biller_key = f"""Biller:\n
  \n
  \n
  \n
  Date:\n
  Invoice No.:\n
  {check_for_existence("key", "po_number", "PO number:")}
  """

  bk_style = ParagraphStyle('biller_key',
                          fontName="CMU Bright SemiBold",
                          fontSize=10,
                          parent=style['Normal'],
                          alignment=2,
                          leading=7,
                          borderPadding=0,
                          leftIndent=0*cm,
                          rightIndent=0,
                          spaceAfter=0,
                          spaceBefore=0,
                          splitLongWords=1,
                          spaceShrinkage=0.05,
                          wordWrap = "LTR",
                          allowWidows=1
                          )

  biller_value = f"""{data['infos']['biller_name']}\n
  {data['infos']['biller_street']}\n
  {data['infos']['biller_location']}\n
  \n
  {datetime.datetime.strptime(data['infos']['date'], '%Y-%m-%d').strftime('%d.%m.%Y')}\n
  {data['infos']['inv_number']}\n
  {check_for_existence("value", "po_number")}
  """

  bv_style = ParagraphStyle('biller_value',
                          parent=bk_style,
                          fontName="CMU Bright",
                          alignment=0,
                          leftIndent=0
                          )

  col_width_1 = [7.3*cm, 6*cm, 4.5*cm]
  table_data_1 = [
    [Paragraph(biller_address.replace("\n", "<br />"), style=ba_style),
     Paragraph(biller_key.replace("\n", "<br />"), style=bk_style), 
     Paragraph(biller_value.replace("\n", "<br />"), style=bv_style)]
  ]

  t1 = Table(table_data_1, colWidths=col_width_1)

  Story.append(t1)

  recipient = f"""{data['infos']['recipient_name']}\n
  {data['infos']['recipient_street']}\n
  {data['infos']['recipient_location']}\n
  """

  r_style = ParagraphStyle('recipient',
                          parent=bv_style,
                          alignment=0,
                          borderPadding=0,
                          leftIndent=0
                          )
  p3 = Paragraph(recipient.replace("\n", "<br />"), r_style)
  Story.append(p3)

  Story.append(s)

  table_data_2 = [["Pos", "Qty", "Item", "Unit Price", "Amount"]]
  for idx in range(len(data["positions"])):
    arr = []
    for key, value in data["positions"][idx].items():
      if key in ("price", "amount"):
        value = f"€ {format(float(value), '.2f')}"
      arr.append(value)
    table_data_2.append(arr)

  table_data_2.append(["", "", "", "", ""])
  table_data_2.append(["Subtotal", "", "", "", f"€ {data['amount']['subtotal']:.2f}"])
  table_data_2.append(["", "", "", "", ""])
  table_data_2.append(["Tax", f"{data['tax']} %", "", "", f"€ {data['amount']['tax']}"])
  table_data_2.append(["", "", "", "", ""])
  table_data_2.append(["Total", "", "", "", f"€ {data['amount']['total']}"])
  
  col_width_2 = [1.3*cm, 1.5*cm, 10.5*cm, 2.3*cm, 2.1*cm]
  t2 = Table(table_data_2, colWidths=col_width_2)

  TABLE_STYLE = TableStyle([
    ('FONT', (0,0), (-1,0), 'CMU Bright SemiBold'),
    ('FONT', (0,1), (-1,-1), 'CMU Bright'),
    ('BACKGROUND', (0,0), (-1,0), '#EEEEEE'),      
    ('BACKGROUND', (0,-5), (-1,-5), '#EEEEEE'),
    ('LINEBELOW', (0,-3), (-1,-3), 0.5, '#EEEEEE'),
    ('FONT', (0,-1), (-1,-1), 'CMU Bright SemiBold'),
  ])

  for idx in range(len(data["positions"])):
    TABLE_STYLE.add('LINEBELOW', (0,idx+1), (-1,idx+1), 0.5, '#EEEEEE')

  t2.setStyle(TABLE_STYLE)

  Story.append(t2)

  doc.build(Story)

  return buffer
