$(document).ready(function() {
    $.getScript('functions.js', function() {
        // Otros códigos...

        function fetchData(url, clearCards = false, platform = 'google') {
            mostrarIndicadorCarga();
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'xml',
                success: function(data) {
                    const productList = $('#productList');

                    if (clearCards) {
                        productList.empty();
                        productos = [];
                    }

                    let productCount = 0;

                    // Procesar los productos en el nivel raíz y dentro de `mas_vendidos` y `mayor_descuento`
                    const rootItems = $(data).find('todos_los_productos > entry');
                    const masVendidosItems = $(data).find('mas_vendidos > entry');
                    const mayorDescuentoItems = $(data).find('mayor_descuento > entry');

                    console.log('Root Items:', rootItems.length);
                    console.log('Más Vendidos Items:', masVendidosItems.length);
                    console.log('Mayor Descuento Items:', mayorDescuentoItems.length);

                    function processItems(items) {
                        items.each(function() {
                            // Procesamiento de datos (sin cambios)
                            // ...
                            productCount++;
                        });
                    }

                    processItems(rootItems);
                    processItems(masVendidosItems);
                    processItems(mayorDescuentoItems);

                    $('#productCount').text(productCount);
                    ocultarIndicadorCarga();
                },
                error: function() {
                    alert('Error al cargar los datos.');
                    ocultarIndicadorCarga();
                }
            });
        }

        // Otros eventos de carga...

    });
});