import json
import datetime
from PyPDF2 import PdfReader, PdfWriter
from flask import Flask, request, send_file
from pdf_generation.create import create_pdf
  
x = datetime.datetime.now()
  
app = Flask(__name__)

@app.route('/api/data', methods = ['GET', 'POST'])
def index():
  if request.method == "GET":
    return {
      "Date":x, 
      "programming":"Python"
    }
  if request.method == "POST":
    data = json.loads(request.data)

    for key, value in data.items():
      print(f"{key}:", value)

    buffer = create_pdf(data)
    buffer.seek(0)

    return send_file(buffer, mimetype='application/pdf', download_name='Invoice.pdf', as_attachment=True)
