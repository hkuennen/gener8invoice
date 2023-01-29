from flask import Flask
import datetime
  
x = datetime.datetime.now()
  
app = Flask(__name__)

@app.route('/api/data', methods = ['GET', 'POST'])
def get_time():
    return {
        "Date":x, 
        "programming":"python"
        }
