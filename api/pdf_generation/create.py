import datetime
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageTemplate, Frame
from reportlab.lib.units import cm
from pdf_generation.styles import h_style, ba_style, bk_style, bv_style, r_style, ak_style, av_style

def create_pdf(data):
  buffer = BytesIO()
  doc = SimpleDocTemplate(buffer, pagesize=A4,
                      rightMargin=1.6*cm, leftMargin=1.6*cm,
                      topMargin=0*cm, bottomMargin=1.6*cm
                      )
  
  def check_for_existence(key_or_value, name, name_on_pdf=None):
    if data['infos'].get(name) == None or len(data['infos'][name]) == 0:
      return '\n'
    elif key_or_value == "key":
      return name_on_pdf + '\n'
    else:
      return data['infos'][name] + '\n'
  
  Story = []

  s = Spacer(1,60)

  title = "INVOICE"
  
  p_title = Paragraph(title, h_style)
  Story.append(p_title)

  biller_address = f"""\n
  \n
  \n
  \n
  <u>{data['infos']['biller_name']}, {data['infos']['biller_street']}, {data['infos']['biller_location']}</u>
  """

  biller_key = f"""Biller:\n
  \n
  \n
  \n
  Date:\n
  Invoice No.:\n
  {check_for_existence("key", "po_number", "PO number:")}
  """

  biller_value = f"""{data['infos']['biller_name']}\n
  {data['infos']['biller_street']}\n
  {data['infos']['biller_location']}\n
  \n
  {datetime.datetime.strptime(data['infos']['date'], '%Y-%m-%d').strftime('%d.%m.%Y')}\n
  {data['infos']['inv_number']}\n
  {check_for_existence("value", "po_number")}
  """

  col_widths_contact_infos = [7.3*cm, 6*cm, 4.5*cm]
  table_contact_infos_data = [
    [Paragraph(biller_address.replace("\n", "<br />"), style=ba_style),
     Paragraph(biller_key.replace("\n", "<br />"), style=bk_style), 
     Paragraph(biller_value.replace("\n", "<br />"), style=bv_style)]
  ]

  t_contact_infos = Table(table_contact_infos_data, colWidths=col_widths_contact_infos)

  Story.append(t_contact_infos)

  recipient = f"""{data['infos']['recipient_name']}\n
  {data['infos']['recipient_street']}\n
  {data['infos']['recipient_location']}\n
  """

  p_recipient = Paragraph(recipient.replace("\n", "<br />"), r_style)
  Story.append(p_recipient)

  Story.append(s)

  table_invoice_positions_data = [["Pos", "Qty", "Item", "Unit Price", "Amount"]]
  for idx in range(len(data["positions"])):
    arr = []
    for key, value in data["positions"][idx].items():
      if key in ("price", "amount"):
        value = f"€ {format(float(value), '.2f')}"
      arr.append(value)
    table_invoice_positions_data.append(arr)

  table_invoice_positions_data.append(["", "", "", "", ""])
  table_invoice_positions_data.append(["Subtotal", "", "", "", f"€ {data['amount']['subtotal']:.2f}"])
  table_invoice_positions_data.append(["", "", "", "", ""])
  table_invoice_positions_data.append(["Tax", f"{data['tax']} %", "", "", f"€ {data['amount']['tax']}"])
  table_invoice_positions_data.append(["", "", "", "", ""])
  table_invoice_positions_data.append(["Total", "", "", "", f"€ {data['amount']['total']}"])
  
  col_widths_invoice_positions = [1.3*cm, 1.5*cm, 10.5*cm, 2.3*cm, 2.1*cm]
  t_invoice_positions = Table(table_invoice_positions_data, colWidths=col_widths_invoice_positions)

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

  t_invoice_positions.setStyle(TABLE_STYLE)

  Story.append(t_invoice_positions)

  acc_holder_key = f"""
  {check_for_existence("key", "acc-holder", "Account holder:")}\n
  {check_for_existence("key", "bank-name", "Bank name:")}\n
  """

  acc_holder_value = f"""
  {check_for_existence("value", "acc-holder")}\n
  {check_for_existence("value", "bank-name")}\n
  """

  acc_number_key = f"""
  {check_for_existence("key", "iban", "IBAN:")}\n
  {check_for_existence("key", "bic", "BIC:")}\n
  """

  acc_number_value = f"""
  {check_for_existence("value", "iban")}\n
  {check_for_existence("value", "bic")}\n
  """

  table_account_details_data = [
    [Paragraph(acc_holder_key.replace("\n", "<br />"), style=ak_style),
     Paragraph(acc_holder_value.replace("\n", "<br />"), style=av_style),
     Paragraph("\n\n".replace("\n", "<br />")),
     Paragraph(acc_number_key.replace("\n", "<br />"), style=ak_style),
     Paragraph(acc_number_value.replace("\n", "<br />"), style=av_style),
     ]
  ]

  col_widths_account_details = [2.6*cm, 5.7*cm, 2.5*cm, 1.3*cm, 5.7*cm]
  t_account_details = Table(table_account_details_data, colWidths=col_widths_account_details)

  def fixed_position(canvas, doc):
    t_account_details.wrapOn(canvas, doc.width, doc.height)
    t_account_details.drawOn(canvas, 1.6*cm, 0.6*cm)

  frame = Frame(1.6*cm, 0, doc.width, doc.height, id='fixed_frame')
  template = PageTemplate(id='fixed_template', frames=[frame], onPage=fixed_position)

  doc.addPageTemplates([template])

  doc.build(Story)

  return buffer
