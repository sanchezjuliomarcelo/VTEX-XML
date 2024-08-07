$(document).ready(function() {
    function fetchData(url, clearCards = false) {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'xml',
            success: function(data) {
                const items = $(data).find('item').length ? $(data).find('item') : $(data).find('entry');
                const productList = $('#productList');

                if (clearCards) {
                    productList.empty();
                }

                let productCount = 0;

                items.each(function() {
                    const productId = $(this).find('product_id').text();
                    const gId = $(this).find('g\\:id').text() || $(this).find('id').text();
                    const productSku = $(this).find('product_sku').text();
                    const gtin = $(this).find('g\\:gtin').text() || $(this).find('gtin').text();
                    const title = $(this).find('g\\:title').text() || $(this).find('title').text();
                    const brand = $(this).find('g\\:brand').text() || $(this).find('brand').text();
                    const productType = $(this).find('g\\:product_type').text() || $(this).find('product_type').text();
                    const descriptionAttributes = $(this).find('description_attributes').html();
                    const description = $(this).find('g\\:description').text() || $(this).find('description').text();
                    const condition = $(this).find('g\\:condition').text() || $(this).find('condition').text();
                    const link = $(this).find('g\\:link').text() || $(this).find('link').text();
                    const imageLink = $(this).find('g\\:image_link').text() || $(this).find('image_link').text();
                    const availability = $(this).find('g\\:availability').text() || $(this).find('availability').text();
                    const price = $(this).find('g\\:price').text() || $(this).find('price').text();
                    const salePrice = $(this).find('g\\:sale_price').text() || $(this).find('sale_price').text();
                    const installmentAmount = $(this).find('g\\:installment').find('g\\:amount').text() || $(this).find('amount').text();
                    const installmentMonths = $(this).find('g\\:installment').find('g\\:months').text() || $(this).find('months').text();
                    const customLabel1 = $(this).find('g\\:custom_label_1').text() || $(this).find('custom_label_1').text() || $(this).find('custom_number_0').text();
                    const customLabel2 = $(this).find('g\\:custom_label_2').text() || $(this).find('custom_label_2').text() || $(this).find('custom_number_1').text();
                    const customLabel3 = $(this).find('g\\:custom_label_3').text() || $(this).find('custom_label_3').text() || $(this).find('custom_number_2').text();
                    const customLabel4 = $(this).find('g\\:custom_label_4').text() || $(this).find('custom_label_4').text() || $(this).find('custom_number_3').text();

                    // Extraer texto de los elementos <li> en description_attributes
                    let descriptionAttributesText = '';
                    if (descriptionAttributes) {
                        const tempDiv = $('<div>').html(descriptionAttributes);
                        descriptionAttributesText = tempDiv.find('li').map(function() {
                            return $(this).text();
                        }).get().join('<br>');
                    }

                    const card = `
                        <div class="col-md-3 product-card">
                            <div class="card mb-4">
                                <img src="${imageLink}" class="card-img-top" alt="${title}">
                                <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text">${description}</p>
                                    <p class="card-text">${descriptionAttributesText}</p>
                                    <p class="card-text"><strong>Marca:</strong> ${brand}</p>
                                    <p class="card-text"><strong>Tipo:</strong> ${productType}</p>
                                    <p class="card-text"><strong>SKU:</strong> ${productSku}</p>
                                    <p class="card-text"><strong>GTIN:</strong> ${gtin}</p>
                                    <p class="card-text"><strong>Condición:</strong> ${condition}</p>
                                    <p class="card-text"><strong>Disponibilidad:</strong> ${availability}</p>
                                    <p class="card-text"><strong>Precio:</strong> ${price}</p>
                                    <p class="card-text"><strong>Precio de venta:</strong> ${salePrice}</p>
                                    <p class="card-text"><strong>Cuotas:</strong> ${installmentAmount} en ${installmentMonths} meses</p>
                                    <p class="card-text"><strong>Descuento estándar:</strong> ${customLabel1}</p>
                                    <p class="card-text"><strong>PVP 1 pago:</strong> ${customLabel2}</p>
                                    <p class="card-text"><strong>Descuento 1 pago:</strong> ${customLabel3}</p>
                                    <p class="card-text"><strong>Monto descuento 1 pago:</strong> ${customLabel4}</p>
                                    <a href="${link}" class="btn btn-primary" target="_blank">Ver Producto</a>
                                </div>
                            </div>
                        </div>
                    `;

                    productList.append(card);

                    productCount++;
                });

                $('#productCount').text(productCount);
            },
            error: function() {
                alert('Error al cargar los datos.');
            }
        });
    }

    // Función para buscar productos en pantalla
    function buscarProductos() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        $('.product-card').each(function() {
            const cardText = $(this).text().toLowerCase();
            if (cardText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Función para borrar productos en pantalla
    function borrarProductos() {
        $('#productList').empty();
        $('#productCount').text('0');
    }

    // Eventos de los botones de búsqueda y borrado
    $('#btnBuscar').click(function() {
        buscarProductos();
    });

    $('#btnBorrar').click(function() {
        borrarProductos();
    });

    // Eventos de los botones de carga de productos
    $('#btnBanghoGoogle').click(function() {
        fetchData('http://localhost:3001/proxy/bangho/google', true);
    });

    $('#btnBanghoFacebook').click(function() {
        fetchData('http://localhost:3001/proxy/bangho/facebook', true);
    });

    $('#btnBanghoEmailMarketing').click(function() {
        fetchData('http://localhost:3001/proxy/bangho/emailmarketing', true);
    });

    $('#btnTidiGoogle').click(function() {
        fetchData('http://localhost:3001/proxy/tidi/google', true);
    });

    $('#btnTidiFacebook').click(function() {
        fetchData('http://localhost:3001/proxy/tidi/facebook', true);
    });

    $('#btnTidiEmailMarketing').click(function() {
        fetchData('http://localhost:3001/proxy/tidi/emailmarketing', true);
    });
});
