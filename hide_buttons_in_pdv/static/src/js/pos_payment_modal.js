/** @odoo-module */

import { Order } from "@point_of_sale/app/store/models";
import { patch } from "@web/core/utils/patch";

patch(Order.prototype, {
    setup() {
        super.setup(...arguments);
		//Cambios en el POS
        this.changePos(this.pos);
	}, 

    changePos(pos){
        // Crear un MutationObserver para observar cambios en el DOM
        const observer = new MutationObserver(() => {            
            this.hide_info_button_products_pdv();
            this.hide_zone_pdv();
            this.hide_zone_form_cliente();
            //this.add_acction_button_facturate_detection();
        });
        
        // Observar cambios en el DOM dentro del contenedor principal
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    
    hide_info_button_products_pdv(){
        // Seleccionar todos los elementos con la clase "product-information-tag"
        const info_buttons = document.querySelectorAll(".product-information-tag");
        // Ocultar los elementos encontrados
        info_buttons.forEach(info_button => {
            // Verificar tiene el campo esta visible
            const have_styles = info_button.hasAttribute('style');
            if (!have_styles) {
                info_button.setAttribute('style', 'display: none !important;')
            }
        });
    },

    hide_zone_pdv(){
        // Seleccionar todos los elementos con la clase "product-information-tag"
        const buttons = document.querySelectorAll(".control-button.btn.btn-light.rounded-0.fw-bolder");
        // Ocultar los elementos encontrados
        buttons.forEach(button => {
            //ocultar unicamente Reembolso
            if(button.textContent.trim() === "Reembolso"){
                button.setAttribute('style', 'display: none !important;')
            }
            //ocultar unicamente Nota de cliente
            if(button.textContent.trim() === "Nota de cliente"){
                button.setAttribute('style', 'display: none !important;')
            }
            //ocultar unicamente Nota de cliente
            if(button.textContent.trim() === "Cotización/orden"){
                button.setAttribute('style', 'display: none !important;')
            }
        });
    },
    hide_zone_form_cliente(){
        // Lista de campos que quieres buscar
        const camposOcultar = [
            "Calle",
            "Ciudad",
            "Código postal",
            "Celular",
            "Código de barras"
        ];
        // Seleccionar todos los div con clase "partner-detail col"
        const divs = document.querySelectorAll("div.partner-detail.col");
        // Iterar sobre cada div
        divs.forEach(div => {
            // Buscar dentro del div si contiene algún label con el texto especificado
            const contieneTexto = Array.from(div.querySelectorAll("label"))
                .some(label => camposOcultar.includes(label.textContent.trim()));
            
            // Si el div contiene un label con el texto, de camposOcultar
            if (contieneTexto) {
                div.setAttribute('style', 'display: none !important;');
            }
        });
    },

    add_acction_button_facturate_detection(){
        const product_screen = document.querySelector('.product-screen');
        if(product_screen){
            const buttons = document.querySelectorAll(
                '.btn-switchpane.btn.flex-fill.rounded-0.fw-bolder.btn-primary, ' +
                '.pay.validation.pay-order-button.btn-primary.button.btn.d-flex.flex-column.flex-fill.align-items-center.justify-content-center.fw-bolder.btn-lg.rounded-0'
            );
    
            // Añadimos un evento de clic a cada botón encontrado
            buttons.forEach(button => {
                button.addEventListener('click', function () {
                    const detect_change = new MutationObserver(() => {            
                        const payment_screen = document.querySelector('.payment-screen');
                        if(payment_screen){
                            const button = document.querySelector('.js_invoice');
                            // Verifica si el botón existe y no tiene las clases "highlight" o "text-bg-primary"
                            if (button && !button.classList.contains('highlight') && !button.classList.contains('text-bg-primary')) {
                                console.log("simulate click");
                                button.click();
                            }
                            //ocultar el boton siempre
                            if(button){
                                console.log("simulate hide");
                                button.setAttribute('style', 'display: none !important;');
                            }
                        }
                    });
                    
                    // Observar cambios en el DOM dentro del contenedor principal
                    detect_change.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            });
        }
    }

});