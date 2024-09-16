function exportToExcel() {
    // Verificar que `productos` está actualizado y contiene datos
    if (!productos || productos.length === 0) {
        alert('No hay productos para exportar.');
        return;
    }

    // Mapear los datos de los productos a un formato adecuado para Excel
    const data = productos.map(producto => {
        return {
            'ID Producto': producto.productId,
            'ID Global': producto.gId,
            'SKU': producto.productSku,
            'GTIN': producto.gtin,
            'Título': producto.title,
            'Marca': producto.brand,
            'Tipo de Producto': producto.productType,
            'Descripción': producto.description,
            'Atributos de Descripción': producto.descriptionAttributes,
            'Condición': producto.condition,
            'Link': producto.link,
            'Imagen': producto.imageLink,
            'Disponibilidad': producto.availability,
            'Precio': producto.price,
            'Precio de Venta': producto.salePrice,
            'Monto de Cuota': producto.installmentAmount,
            'Meses de Cuota': producto.installmentMonths,
            'Descuento Estandar': producto.customLabel1,
            'PVP en 1 Pago': producto.customLabel2,
            '% Descuento en 1 Pago': producto.customLabel3,
            '$ Descuento en 1 Pago': producto.customLabel4,
            'Categoría': producto.category || '' // Asegúrate de que `category` esté disponible
        };
    });

    // Convertir los datos a una hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Crear un libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");

    // Exportar el libro de trabajo como archivo Excel
    XLSX.writeFile(wb, "productos.xlsx");
}
