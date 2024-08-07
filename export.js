function exportToExcel() {
    if (productos.length === 0) {
        alert('No hay productos para exportar.');
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(productos, {header: [
        "productId", "gId", "productSku", "gtin", "title", "brand", "productType", 
        "descriptionAttributes", "description", "condition", "link", "imageLink", 
        "availability", "price", "salePrice", "installmentAmount", "installmentMonths", 
        "customLabel1", "customLabel2", "customLabel3", "customLabel4"
    ]});
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    
    XLSX.writeFile(workbook, 'productos.xlsx');
}
