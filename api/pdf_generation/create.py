import datetime
from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
)

from pdf_generation.styles import (
    TABLE_STYLE_POSITIONS_FIRST_PAGE,
    TABLE_STYLE_POSITIONS_OTHER_PAGES,
    TABLE_STYLE_SUM,
    ak_style,
    av_style,
    ba_style,
    bk_style,
    bv_style,
    h_style,
    r_style,
)


class PDFCreator:
    def __init__(self, data):
        self.data = data

    def create_pdf(self):
        buffer = BytesIO()
        doc = BaseDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=1.6 * cm,
            leftMargin=1.6 * cm,
            topMargin=0 * cm,
            bottomMargin=1.6 * cm,
        )

        Story = []
        s = Spacer(1, 60)

        # Title
        title = "INVOICE"
        p_title = Paragraph(title, h_style)
        Story.append(p_title)

        # Contact Infos
        Story = self.generate_contact_infos(Story)
        Story.append(s)

        # Invoice Positions
        Story = self.generate_invoice_positions(Story)

        # Account Details
        doc = self.generate_account_details(doc)

        # Building document
        doc.build(Story)
        return buffer

    def generate_contact_infos(self, Story):
        biller_address = f"""\n
        \n
        \n
        \n
        <u>{self.data["infos"]["biller_name"]}, {self.data["infos"]["biller_street"]}, {self.data["infos"]["biller_location"]}</u>
        """

        biller_key = f"""Biller:\n
        \n
        \n
        \n
        Date:\n
        Invoice No.:\n
        {self.check_for_existence(name="po_number", name_on_pdf="PO number:")}
        """

        biller_value = f"""{self.data["infos"]["biller_name"]}\n
        {self.data["infos"]["biller_street"]}\n
        {self.data["infos"]["biller_location"]}\n
        \n
        {datetime.datetime.strptime(self.data["infos"]["date"], "%Y-%m-%d").strftime("%d.%m.%Y")}\n
        {self.data["infos"]["inv_number"]}\n
        {self.check_for_existence(name="po_number")}
        """

        col_widths_contact_infos = [7.3 * cm, 6 * cm, 4.5 * cm]
        table_contact_infos_data = [
            [
                Paragraph(biller_address.replace("\n", "<br />"), style=ba_style),
                Paragraph(biller_key.replace("\n", "<br />"), style=bk_style),
                Paragraph(biller_value.replace("\n", "<br />"), style=bv_style),
            ]
        ]

        t_contact_infos = Table(
            table_contact_infos_data, colWidths=col_widths_contact_infos
        )

        Story.append(t_contact_infos)

        recipient = f"""{self.data["infos"]["recipient_name"]}\n
        {self.data["infos"]["recipient_street"]}\n
        {self.data["infos"]["recipient_location"]}\n
        """

        p_recipient = Paragraph(recipient.replace("\n", "<br />"), r_style)
        Story.append(p_recipient)
        return Story

    def generate_invoice_positions(self, Story):
        positions = self.data["positions"]
        table_invoice_positions_data = [["Pos", "Qty", "Item", "Unit Price", "Amount"]]
        for idx in range(len(positions)):
            arr = []
            for key, value in positions[idx].items():
                if key == "pos":
                    value = idx + 1
                if key in ("price", "amount"):
                    value = f"€ {format(float(value), '.2f')}"
                arr.append(value)
            table_invoice_positions_data.append(arr)

        for i in range(len(positions)):
            TABLE_STYLE_POSITIONS_FIRST_PAGE.add(
                "LINEBELOW", (0, i + 1), (-1, i + 1), 0.5, "#EEEEEE"
            )
            TABLE_STYLE_POSITIONS_OTHER_PAGES.add(
                "LINEBELOW", (0, i), (-1, i), 0.5, "#EEEEEE"
            )

        MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION = self.data["maxPositionsPerPage"][
            "firstPageBeforePagination"
        ]
        MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION = self.data["maxPositionsPerPage"][
            "firstPageAfterPagination"
        ]
        MAX_ROWS_PER_OTHER_PAGES_BEFORE_PAGINATION = self.data["maxPositionsPerPage"][
            "otherPagesBeforePagination"
        ]
        MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION = self.data["maxPositionsPerPage"][
            "otherPagesAfterPagination"
        ]

        def paginate_positions():
            max_rows_first_page = MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION
            max_rows_other_pages = MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION

            positions_per_page = []
            i = 0

            # Iterate over the positions to split into pages
            while i < len(table_invoice_positions_data):
                # Determine the maximum rows for the current page
                max_rows = (
                    max_rows_first_page + 1
                    if len(positions_per_page) == 0
                    else max_rows_other_pages
                )

                # Slice the positions data
                page_rows = table_invoice_positions_data[i : i + max_rows]
                positions_per_page.append(page_rows)

                # Move to the next chunk
                i += max_rows

            return positions_per_page

        def generate_paginated_tables(Story):
            paginated_positions = paginate_positions()

            for idx, page_rows in enumerate(paginated_positions):
                # Use different table styles for the first page and subsequent pages
                if idx == 0:
                    table_style = TABLE_STYLE_POSITIONS_FIRST_PAGE
                else:
                    table_style = TABLE_STYLE_POSITIONS_OTHER_PAGES

                # Generate the table for the current page
                self.generate_table(page_rows, table_style, Story)

                # Add a PageBreak after every page except the last one
                if (
                    idx == 0
                    and len(page_rows) >= MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION + 1
                ) or (
                    idx > 0
                    and len(page_rows) > MAX_ROWS_PER_OTHER_PAGES_BEFORE_PAGINATION
                ):
                    Story.append(PageBreak())

        generate_paginated_tables(Story)

        table_invoice_sum_data = []
        table_invoice_sum_data.append(["", "", "", "", ""])
        table_invoice_sum_data.append(
            ["Subtotal", "", "", "", f"€ {self.data['amount']['subtotal']:.2f}"]
        )
        table_invoice_sum_data.append(["", "", "", "", ""])
        table_invoice_sum_data.append(
            ["Tax", f"{self.data['tax']} %", "", "", f"€ {self.data['amount']['tax']}"]
        )
        table_invoice_sum_data.append(["", "", "", "", ""])
        table_invoice_sum_data.append(
            ["Total", "", "", "", f"€ {self.data['amount']['total']}"]
        )

        self.generate_table(table_invoice_sum_data, TABLE_STYLE_SUM, Story)
        return Story

    def generate_account_details(self, doc):
        acc_holder_key = f"""
        {self.check_for_existence(name="acc_holder", name_on_pdf="Account holder:")}\n
        {self.check_for_existence(name="bank_name", name_on_pdf="Bank name:")}\n
        """

        acc_holder_value = f"""
        {self.check_for_existence(name="acc_holder")}\n
        {self.check_for_existence(name="bank_name")}\n
        """

        acc_number_key = f"""
        {self.check_for_existence(name="iban", name_on_pdf="IBAN:")}\n
        {self.check_for_existence(name="bic", name_on_pdf="BIC:")}\n
        """

        acc_number_value = f"""
        {self.check_for_existence(name="iban")}\n
        {self.check_for_existence(name="bic")}\n
        """

        table_account_details_data = [
            [
                Paragraph(acc_holder_key.replace("\n", "<br />"), style=ak_style),
                Paragraph(acc_holder_value.replace("\n", "<br />"), style=av_style),
                Paragraph("\n\n".replace("\n", "<br />")),
                Paragraph(acc_number_key.replace("\n", "<br />"), style=ak_style),
                Paragraph(acc_number_value.replace("\n", "<br />"), style=av_style),
            ]
        ]

        col_widths_account_details = [2.6 * cm, 5.7 * cm, 2.5 * cm, 1.3 * cm, 5.7 * cm]
        t_account_details = Table(
            table_account_details_data, colWidths=col_widths_account_details
        )

        def fixed_position(canvas, doc):
            t_account_details.wrapOn(canvas, doc.width, doc.height)
            t_account_details.drawOn(canvas, 1.6 * cm, 0.6 * cm)

        frame = Frame(1.6 * cm, 0, doc.width, doc.height, id="fixed_frame")
        template = PageTemplate(
            id="fixed_template", frames=[frame], onPage=fixed_position
        )

        doc.addPageTemplates([template])
        return doc

    # helper methods
    def check_for_existence(self, **kwargs):
        name = kwargs["name"]

        if not self.data["infos"].get(name):
            return "\n"

        if "name_on_pdf" in kwargs:
            return kwargs["name_on_pdf"] + "\n"

        return self.data["infos"][name] + "\n"

    def generate_table(self, rows, style, Story):
        col_widths = [1.3 * cm, 1.5 * cm, 10.5 * cm, 2.3 * cm, 2.1 * cm]
        page_table = Table(rows, colWidths=col_widths)
        page_table.setStyle(style)
        Story.append(page_table)
        return Story
