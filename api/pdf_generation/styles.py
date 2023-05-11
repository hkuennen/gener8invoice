from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

pdfmetrics.registerFont(TTFont('CMU Bright', 'pdf_generation/fonts/cmunbmr.ttf'))
pdfmetrics.registerFont(TTFont('CMU Bright SemiBold', 'pdf_generation/fonts/cmunbsr.ttf'))

style = getSampleStyleSheet()
h_style = ParagraphStyle('header',
                        fontName="CMU Bright SemiBold",
                        fontSize=16,
                        parent=style['Normal'],
                        )

ba_style = ParagraphStyle('biller_address',
                      fontName="CMU Bright",
                      fontSize=8,
                      parent=style['Normal'],
                      alignment=0
                      )

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

bv_style = ParagraphStyle('biller_value',
                        parent=bk_style,
                        fontName="CMU Bright",
                        alignment=0,
                        leftIndent=0
                        )

r_style = ParagraphStyle('recipient',
                        parent=bv_style,
                        alignment=0,
                        borderPadding=0,
                        leftIndent=0
                        )

ak_style = ParagraphStyle('acc-key',
                      parent=bk_style,
                      fontSize=9,
                      alignment=0,
                      leftIndent=0
                      )

av_style = ParagraphStyle('acc-value',
                      parent=bv_style,
                      fontSize=9
                      )