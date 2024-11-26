import json
from django.shortcuts import render
from django.http import HttpResponse
from pdf_generation.create import PDFCreator


def index(request):
    return render(request, "index.html")


def data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        pdf = PDFCreator(data)
        buffer = pdf.create_pdf()
        buffer.seek(0)
        response = HttpResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="Invoice.pdf"'
        return response
