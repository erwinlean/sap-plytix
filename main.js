"use strict";

/**
 *  Script requirements:
 *  Install Node.js version used 20.11.1 
 *  packages requeriments: node-fetch, os-utils, dotenv
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
        if(newProductsData.length <= 10){
            newProductsData.map(async productData => await postNewProducts(token, productData));
        }else{
            // Handle the create products if there are more than 10 products
            await multiplePosts(postNewProducts, getPlytixToken, newProductsData);
        };

        // Update attributes of the product on the PIM
        if(newProductsData.length <= 10){
            newProductsData.map(async productData => await updateProductsData(token, productData.plytixId, productData));
        }else{
            // Handle the update products if there are more than 10 products
             const update = true;
            await multiplePosts(updateProductsData, getPlytixToken, updateProductsAtrData, update);
        };

        // Check memory usage
        checkMemory();

        // End script and log save.
        return createLog("Synchronization between SAP and Plytix ended");
    } catch (err) {
        createLog("Error main: " + err);
        console.log(err);
        throw new Error(err);
    };
};

// Init
main ();