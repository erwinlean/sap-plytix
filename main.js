"use strict";

/**
 *  Script requirements:
 *  Install Node.js version used 20.11.1 
 *  packages requeriments: node-fetch, os-utils, dotenv
 */

/*
    V1.1 agregar:
    - Cuando se realiza un update de producto a plytix, se guarda el producto y que es lo que se hizo update. Si  en una nueva llamada, lo que se va a hacer update, es lo mismo que la vez anterior, significa que ya se hizo el cambio, y lo cambiaron en el PIM por que correspondia. Por lo tanto no serealiza el cambio (debe ser exactamente igual el cambio)
    - Agregar filtro y categoria para Novum, a partir de identificar los productos NOVUN por su sku.
*/

// Functions and variables needed
const {
    getProducts,
    urls,
    getAllProducts,
    getPlytixToken,
    postNewProducts,
    updateProductsData,
    comparasionForNewProduct,
    comparasionForAttributesUpdate,
    multiplePosts,
    createLog,
    checkMemory
} = require("./config");

/**
 *  Performs synchronization between SAP and Plytix.
 *  Retrieves information from SAP, compares it with the PIM (Plytix), and creates new products in the PIM as needed.
 *  Check if some attribute of products in the PIM as been updated in SAP and update on the PIM after that.
 *  Logs events and errors to a log file.
 *  @returns {Promise<void>} A promise indicating the completion of the synchronization.
 */
async function main() {
    try {
        createLog("Synchronization between SAP and Plytix Started.");

        // Get the producs from SAP
        const sapProducts = [];
        for (const urlInfo of urls) {
            sapProducts.push(await getProducts(urlInfo))
        };

        // Get the produts from Plytix
        const token = await getPlytixToken();
        const pimProducts = await getAllProducts(token);

        // Data process
        const newProductsData = await comparasionForNewProduct(pimProducts, sapProducts);
        const updateProductsAtrData = await comparasionForAttributesUpdate(pimProducts, sapProducts);

        // Post new products
        //if(newProductsData.length <= 10){
        //    newProductsData.map(async productData => await postNewProducts(token, productData));
        //}else{
        //    // Handle the create products if there are more than 10 products
        //    await multiplePosts(postNewProducts, getPlytixToken, newProductsData);
        //};
//
        //// Update attributes of the product on the PIM
        //if(updateProductsAtrData.length <= 10){
        //    updateProductsAtrData.map(async productData => await updateProductsData(token, productData.plytixId, productData));
        //}else{
        //    // Handle the update products if there are more than 10 products
        //    const update = true;
        //    await multiplePosts(updateProductsData, getPlytixToken, updateProductsAtrData, update);
        //};

        // Check memory usage
        checkMemory();

        // End script and log save.
        createLog("Synchronization between SAP and Plytix ended");
        return createLog("------------------------------------------------------------------");
    } catch (err) {
        createLog("Error main: " + err);
        console.log(err);
        throw new Error(err);
    };
};

// Init
main ();