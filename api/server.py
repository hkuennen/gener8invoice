import json
import datetime
from flask import Flask, request
from pdf_generation.download import download_pdf
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

    print(data["inputs"]["inv_number"])
    create_pdf(data)
    return json.dumps({'success':True, 'status': 200, 'ContentType':'application/json', 'response': data})
