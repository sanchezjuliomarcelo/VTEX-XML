let productos = [];

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
                    productos = [];
                }

                let productCount = 0;

                items.each(function() {
                    const productId = $(this).find('product_id').text() || '';
                    const gId = $(this).find('g\\:id').text() || $(this).find('id').text() || '';
                    const productSku = $(this).find('product_sku').text() || '';
                    const gtin = $(this).find('g\\:gtin').text() || $(this).find('gtin').text() || '';
                    const title = $(this).find('g\\:title').text() || $(this).find('title').text() || '';
                    const brand = $(this).find('g\\:brand').text() || $(this).find('brand').text() || '';
                    const productType = $(this).find('g\\:product_type').text() || $(this).find('product_type').text() || '';
                    const descriptionAttributes = $(this).find('description_attributes').text() || '';
                    const description = $(this).find('g\\:description').text() || $(this).find('description').text() || '';
                    const condition = $(this).find('g\\:condition').text() || $(this).find('condition').text() || '';
                    const link = $(this).find('g\\:link').text() || $(this).find('link').text() || '';
                    const imageLink = $(this).find('g\\:image_link').text() || $(this).find('image_link').text() || '';
                    const availability = $(this).find('g\\:availability').text() || $(this).find('availability').text() || '';
                    const price = $(this).find('g\\:price').text() || $(this).find('price').text() || '';
                    const salePrice = $(this).find('g\\:sale_price').text() || $(this).find('sale_price').text() || '';
                    const installmentAmount = $(this).find('g\\:installment').find('g\\:amount').text() || $(this).find('amount').text() || '';
                    const installmentMonths = $(this).find('g\\:installment').find('g\\:months').text() || $(this).find('months').text() || '';
                    // Assume labels vary by XML and are directly extracted
                    const labels = $(this).find('[class^="custom_label"]').toArray().reduce((acc, el) => {
                        acc[$(el).prop('tagName').toLowerCase()] = $(el).text();
                        return acc;
                    }, {});

                    const producto = {
                        productId, gId, productSku, gtin, title, brand, productType, 
                        descriptionAttributes, description, condition, link, imageLink, 
                        availability, price, salePrice, installmentAmount, installmentMonths, 
                        ...labels
                    };

                    // Validar campos críticos
                    if (title && description && price) {
                        productos.push(producto);

                        const card = `
                            <div class="col-md-3 product-card">
                                <div class="card mb-3">
                                    <img src="${imageLink}" class="card-img-top" alt="${title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${title}</h5>
                                        <p class="card-text">${description}</p>
                                        <p class="card-text">${descriptionAttributes}</p>
                                        <p class="card-text"><strong>Marca:</strong> ${brand}</p>
                                        <p class="card-text"><strong>Tipo:</strong> ${productType}</p>
                                        <p class="card-text"><strong>SKU:</strong> ${productSku}</p>
                                        <p class="card-text"><strong>GTIN:</strong> ${gtin}</p>
                                        <p class="card-text"><strong>Condición:</strong> ${condition}</p>
                                        <p class="card-text"><strong>Disponibilidad:</strong> ${availability}</p>
                                        <p class="card-text"><strong>Precio:</strong> ${price}</p>
                                        <p class="card-text"><strong>Precio de venta:</strong> ${salePrice}</p>
                                        <p class="card-text"><strong>monto:</strong> ${installmentAmount}</p>
                                        <p class="card-text"><strong>meses:</strong> ${installmentMonths}</p>
                                        <p class="card-text">${Object.keys(labels).map(key => `<strong>${key.replace('_', ' ')}:</strong> ${labels[key]}`).join('<br>')}</p>
                                        <a href="${link}" class="btn btn-primary" target="_blank">Ver Producto</a>
                                    </div>
                                </div>
                            </div>
                        `;

                        productList.append(card);

                        productCount++;
                    }
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
        productos = [];
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

    // Evento del botón de exportación
    $('#btnexportar').click(function() {
        exportToExcel();
    });
});
