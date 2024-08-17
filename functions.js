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

// Función para mostrar indicador de carga
function mostrarIndicadorCarga() {
    const indicador = `
        <div id="indicadorCarga" class="text-center">
            <p>Cargando...</p>
            <img src="https://mysejahtera.malaysia.gov.my/register/images/loader.gif" alt="Cargando" />
        </div>
    `;
    $('body').append(indicador);
}

// Función para ocultar indicador de carga
function ocultarIndicadorCarga() {
    $('#indicadorCarga').remove();
}

