const fs = require('fs');

// Función para guardar productos en un archivo JSON
const guardarProductosJSON = (data) => {
    try {
        // Convertir la lista de productos a formato JSON
        const datosJSON = JSON.stringify(data, null, 2);
        
        // Escribir los datos JSON en el archivo especificado
        fs.writeFileSync("Products", datosJSON);
        
        console.log(`Productos guardados en  correctamente EN JSON.`);
    } catch (error) {
        console.error('Error al guardar productos:', error);
    }
};

module.exports = guardarProductosJSON;