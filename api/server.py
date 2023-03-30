import json
from flask import Flask, request
import datetime
  
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
        return json.dumps({'success':True, 'status': 200, 'ContentType':'application/json'})
