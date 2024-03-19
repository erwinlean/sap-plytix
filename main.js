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
const { getProducts, urls } = require("./sap/getProducts");
const getAllProducts = require("./plytix/getProducts");
const getPlytixToken = require("./plytix/auth");
const postNewProducts = require("./plytix/postProducts");
const getPlytixTokenTest = require("./plytix/testauth");
const comparasion = require("./dataProcessing/dataComparison");
const createLog = require("./logs/logs");
const checkMemory = require("./CPU/memory");

/**
 *  Performs synchronization between SAP and Plytix.
 *  Retrieves information from SAP, compares it with the PIM (Plytix), and creates new products in the PIM as needed.
 *  Logs events and errors to a log file.
 *  @returns {Promise<void>} A promise indicating the completion of the synchronization.
 */
async function main() {
    try {

        // SAP
        const sapProducts = [];
        for (const urlInfo of urls) {
            sapProducts.push(await getProducts(urlInfo))
        };

        // Plytix
        const token = await getPlytixToken();
        const pimProducts = await getAllProducts(token);

        // Data process
        const newProductsData = await comparasion(pimProducts, sapProducts);

        // Post new product from SAP on the PIM
        const testToken = await getPlytixTokenTest(); // This token will be remove in prod, use just token
        const postPromises = newProductsData.map(productData => postNewProducts(testToken, productData));
        await Promise.all(postPromises);

        // End and log save.
        createLog("Synchronization between SAP and Plytix ended");

        // Check memory usage
        checkMemory();

        // Script time end
        const endTime = new Date();
        const elapsedTime = endTime - startTime;
        console.log('Elapsed Time (ms):', elapsedTime);

        return console.log("Synchronization between SAP and Plytix ended.");
    } catch (err) {
        createLog("Error main: " + err);
        console.log("Error main:", err);
        throw new Error(err);
    };
};

// Init Synchronization
main();