$(document).ready(function() {
    $.getScript('functions.js', function() {
        $('#btnBuscar').click(buscarProductos);
        $('#btnBorrar').click(() => {
            borrarProductos();
            $('#productCount, #masVendidosCount, #mayorDescuentoCount').text('0');
        });
        $('#btnExportar').click(exportToExcel);

        function fetchData(url, clearCards = false, platform = 'google') {
            mostrarIndicadorCarga();
            $.ajax({
                url,
                method: 'GET',
                dataType: 'xml',
                success: function(data) {
                    if (clearCards) {
                        $('#productList').empty();
                        productos = [];
                    }

                    const todosLosProductos = platform === 'emailmarketing'
                        ? $(data).find('todos_los_productos > entry')
                        : $(data).find('channel > item');

                    // Seleccionar productos en mas_vendidos y mayor_descuento
                    const masVendidosItems = $(data).find('mas_vendidos > entry');
                    const mayorDescuentoItems = $(data).find('mayor_descuento > entry');

                    // Contadores
                    const totalTodosLosProductos = todosLosProductos.length;
                    const totalMasVendidosItems = masVendidosItems.length;
                    const totalMayorDescuentoItems = mayorDescuentoItems.length;

                    // Mostrar contadores
                    $('#rootItemsCount').text(`Todos los Productos: ${totalTodosLosProductos}`);
                    $('#masVendidosItemsCount').text(`Más Vendidos Items: ${totalMasVendidosItems}`);
                    $('#mayorDescuentoItemsCount').text(`Mayor Descuento Items: ${totalMayorDescuentoItems}`);

                    function processItems(items, list, category) {
                        items.each(function() {
                            const producto = {
                                productId: $(this).find('product_id').text() || '',
                                gId: $(this).find('g\\:id').text() || $(this).find('id').text() || '',
                                productSku: $(this).find('product_sku').text() || '',
                                gtin: $(this).find('g\\:gtin').text() || $(this).find('gtin').text() || '',
                                title: $(this).find('g\\:title').text() || $(this).find('title').text() || '',
                                brand: $(this).find('g\\:brand').text() || $(this).find('brand').text() || '',
                                productType: $(this).find('g\\:product_type').text() || $(this).find('product_type').text() || '',
                                descriptionAttributes: '',
                                description: $(this).find('g\\:description').text() || $(this).find('description').text() || '',
                                condition: $(this).find('g\\:condition').text() || $(this).find('condition').text() || '',
                                link: $(this).find('g\\:link').text() || $(this).find('link').text() || '',
                                imageLink: $(this).find('g\\:image_link').text() || $(this).find('image_link').text() || '',
                                availability: $(this).find('g\\:availability').text() || $(this).find('availability').text() || '',
                                price: $(this).find('price').text() || '', // Procesar el precio tachado
                                salePrice: $(this).find('sale_price').text() || '',
                                installmentAmount: $(this).find('g\\:installment').find('g\\:amount').text() || $(this).find('amount').text() || '',
                                installmentMonths: $(this).find('g\\:installment').find('g\\:months').text() || $(this).find('months').text() || '',
                                customLabel1: $(this).find('custom_label_1').text() || '',
                                customLabel2: $(this).find('custom_label_2').text() || '',
                                customLabel3: $(this).find('custom_label_3').text() || '',
                                customLabel4: $(this).find('custom_label_4').text() || ''
                            };
                        
                            // Procesar description_attributes para mostrar como texto plano
                            $(this).find('description_attributes').each(function() {
                                producto.descriptionAttributes += $(this).text() + '<br>';
                            });
                        
                            productos.push(producto);
                        
                            const card = `
                                <div class="col-md-3 product-card ${category}">
                                    <div class="card mb-3">
                                        <img src="${producto.imageLink}" class="card-img-top" alt="${producto.title}">
                                        <div class="card-body">
                                            <h5 class="card-title">${producto.title}</h5>
                                            ${producto.descriptionAttributes}
                                            <p class="card-text">${producto.description}</p>
                                            <p class="card-text"><strong>Marca:</strong> ${producto.brand}</p>
                                            <p class="card-text"><strong>Tipo:</strong> ${producto.productType}</p>
                                            <p class="card-text"><strong>SKU:</strong> ${producto.productSku}</p>
                                            <p class="card-text"><strong>GTIN:</strong> ${producto.gtin}</p>
                                            <p class="card-text"><strong>Condición:</strong> ${producto.condition}</p>
                                            <p class="card-text"><strong>Disponibilidad:</strong> ${producto.availability}</p>
                                            <p class="card-text"><strong>Precio:</strong> ${producto.price}</p> <!-- Mostrar el precio con tachado -->
                                            <p class="card-text"><strong>Precio de venta:</strong> ${producto.salePrice}</p>
                                            <p class="card-text"><strong>Monto:</strong> ${producto.installmentAmount}</p>
                                            <p class="card-text"><strong>Meses:</strong> ${producto.installmentMonths}</p>
                                            <p class="card-text"><strong>Descuento Estandar:</strong> ${producto.customLabel1}</p>
                                            <p class="card-text"><strong>PVP en 1 Pago:</strong> ${producto.customLabel2}</p>
                                            <p class="card-text"><strong>% Descuento en 1 Pago:</strong> ${producto.customLabel3}</p>
                                            <p class="card-text"><strong>$ Descuento en 1 Pago:</strong> ${producto.customLabel4}</p>
                                            <a href="${producto.link}" class="btn btn-primary" target="_blank">Ver Producto</a>
                                        </div>
                                    </div>
                                </div>
                            `;
                        
                            list.append(card);
                        });
                    }

                    // Procesar y mostrar los productos
                    processItems(todosLosProductos, $('#productList'), 'Todos los Productos');
                    processItems(masVendidosItems, $('#productList'), 'Más Vendidos');
                    processItems(mayorDescuentoItems, $('#productList'), 'Mayor Descuento');

                    // Actualizar los contadores de elementos
                    $('#rootItemsCount').text(`Todos los Productos: ${totalTodosLosProductos}`);
                    $('#masVendidosItemsCount').text(`Más Vendidos Items: ${totalMasVendidosItems}`);
                    $('#mayorDescuentoItemsCount').text(`Mayor Descuento Items: ${totalMayorDescuentoItems}`);

                    // Finalizar la carga
                    ocultarIndicadorCarga();
                },
                error: function() {
                    alert('Error al cargar los datos.');
                    ocultarIndicadorCarga();
                }
            });
        }

        const endpoints = {
            banghoGoogle: 'https://vtex-xml.vercel.app/proxy/bangho/google',
            banghoFacebook: 'https://vtex-xml.vercel.app/proxy/bangho/facebook',
            banghoEmailMarketing: 'https://vtex-xml.vercel.app/proxy/bangho/emailmarketing',
            tidiGoogle: 'https://vtex-xml.vercel.app/proxy/tidi/google',
            tidiFacebook: 'https://vtex-xml.vercel.app/proxy/tidi/facebook',
            tidiEmailMarketing: 'https://vtex-xml.vercel.app/proxy/tidi/emailmarketing'
        };

        $('#btnBanghoGoogle').click(() => fetchData(endpoints.banghoGoogle, true, 'google'));
        $('#btnBanghoFacebook').click(() => fetchData(endpoints.banghoFacebook, true, 'facebook'));
        $('#btnBanghoEmailMarketing').click(() => fetchData(endpoints.banghoEmailMarketing, true, 'emailmarketing'));
        $('#btnTidiGoogle').click(() => fetchData(endpoints.tidiGoogle, true, 'google'));
        $('#btnTidiFacebook').click(() => fetchData(endpoints.tidiFacebook, true, 'facebook'));
        $('#btnTidiEmailMarketing').click(() => fetchData(endpoints.tidiEmailMarketing, true, 'emailmarketing'));

        function exportToExcel() {
            // Implementar exportación a Excel según los datos en #productList
        }

        function borrarProductos() {
            $('#productList').empty();
            $('#rootItemsCount').text('Todos los Productos: 0');
            $('#masVendidosItemsCount').text('Más Vendidos Items: 0');
            $('#mayorDescuentoItemsCount').text('Mayor Descuento Items: 0');
        }
    });
});
