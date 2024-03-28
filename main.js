"use strict";

/**
 *  Script requirements:
 *  Install Node.js version used 20.11.1
 *  npm install node-fetch
 *  npm install os-utils
 */

// Start time (check script timing)
const startTime = new Date();

// Functions and variables needed
const {
    getProducts,
    urls,
    getAllProducts,
    getPlytixToken,
    postNewProducts,
    getPlytixTokenTest,
    comparasion,
    multiplePosts,
    createLog,
    checkMemory
} = require("./config");

/**
 *  Performs synchronization between SAP and Plytix.
 *  Retrieves information from SAP, compares it with the PIM (Plytix), and creates new products in the PIM as needed.
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
        const newProductsData = await comparasion(pimProducts, sapProducts);

        // Post new product from SAP on the PIM (TEST ENVIRONMENT USING NEW TOKEN NOT PROD ENV).
        const testToken = await getPlytixTokenTest(); // This token will be remove in prod, use just token

        // Post new products
        // Diferent handle if there are more of 10 products, because Request limit of the API
        if(newProductsData.length <= 10){
            newProductsData.map(async productData => await postNewProducts(testToken, productData));
        }else{
            // Handle the create products if there are more than 10 products
            await multiplePosts(postNewProducts, testToken, newProductsData);
        };

        // Check memory usage
        checkMemory();

        // Script time end
        const endTime = new Date();
        const elapsedTime = endTime - startTime;
        console.log('Elapsed Time (ms):', elapsedTime);

        // End script and log save.
        return createLog("Synchronization between SAP and Plytix ended");
    } catch (err) {
        createLog("Error main: " + err);
            console.log("Error main:", err);
        throw new Error(err);
    };
};

// init Synchronization
main ();