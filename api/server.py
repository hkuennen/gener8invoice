import json
import datetime
from flask import Flask, request
from pdf_generation.pdf_assembler import pdf_func
  
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
    result = create_pdf(data)
    print(result)
    return json.dumps({'success':True, 'status': 200, 'ContentType':'application/json', 'response': data})
  
async def create_pdf(data):
  pdf = await pdf_func(data)
  return pdf
