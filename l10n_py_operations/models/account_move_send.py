# -*- coding:utf-8 -*-

from odoo import api, models, fields
import base64

import logging
_logger = logging.getLogger(__name__)



class AccountMoveSend(models.TransientModel):
    _inherit = ['account.move.send']    

    
    
    @api.model
    def _prepare_invoice_pdf_report(self, invoice, invoice_data):
        if invoice.invoice_pdf_report_id:
            return

        #content, _report_format = self.env['ir.actions.report']._render(f'l10n_bo_bolivian_invoice.ir_actions_report_invoice_bo_{invoice[0].pos_id.paper_format_type}', invoice.ids)
        if invoice[0].company_id.use_auto_invoice:
            content, _report_format = self.env['ir.actions.report']._render(f'l10n_py_operations.ir_actions_report_invoice_py_1', invoice.ids)

            invoice_data['pdf_attachment_values'] = {
                'raw': content,
                'name': invoice._get_invoice_report_filename(),
                'mimetype': 'application/pdf',
                'res_model': invoice._name,
                'res_id': invoice.id,
                'res_field': 'invoice_pdf_report_file', # Binary field
            }
        else:
            content = invoice.get_request_pdf()
            if content:
                pdf_binary_content = base64.b64decode(content)

                with open("output.pdf", "wb") as pdf_file:
                    pdf_file.write(pdf_binary_content)

                invoice_data['pdf_attachment_values'] = {
                    'raw': pdf_binary_content,
                    'name': invoice._get_invoice_report_filename(),
                    'mimetype': 'application/pdf',
                    'res_model': invoice._name,
                    'res_id': invoice.id,
                    'res_field': 'invoice_pdf_report_file', # Binary field
                }
            else:
                
                super(AccountMoveSend, self)._prepare_invoice_pdf_report(invoice, invoice_data)
                