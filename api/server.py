import json
import datetime
from flask import Flask, request, send_file, send_from_directory
from flask_cors import CORS, cross_origin
from pdf_generation.create import create_pdf
  
x = datetime.datetime.now()
  
app = Flask(__name__, static_folder='./build')
CORS(app)

@app.route('/api/data', methods = ['GET', 'POST'])
@cross_origin()
def index():
  if request.method == "POST":
    data = json.loads(request.data)
    buffer = create_pdf(data)
    buffer.seek(0)
    return send_file(buffer, mimetype='application/pdf', download_name='Invoice.pdf', as_attachment=True)
  
@app.route('/')
@cross_origin()
def serve():
  return send_from_directory(app.static_folder, 'index.html')
