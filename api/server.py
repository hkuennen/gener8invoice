import json
import datetime
from flask import Flask, make_response, request, send_file
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
    pdf_value = create_pdf(data)
    #f"Invoice No. {data['inputs']['inv_number']}.pdf"
    response = make_response(pdf_value)
    response.headers['Content-Disposition'] = "attachment; filename='test.pdf"
    response.mimetype = 'application/pdf'
  
    return response
    # return send_file(pdf_value, mimetype='application/pdf', download_name='test.pdf', as_attachment=True)
#    return json.dumps({'success':True, 'status': 200, 'ContentType':'application/json', 'response': data})
