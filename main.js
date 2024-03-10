"use strict";
/**
 *  Script requirements:
 *  Install Node.js version used 20.11.1
 *  npm install node-fetch
 */

// Functions and variables needed
const { getProducts, urls } = require("./sap/getProducts");
const getAllProducts = require("./plytix/getProducts");
const getPlytixToken = require("./plytix/auth");
const postNewProducts = require("./plytix/postProducts");
const getPlytixTokenTest = require("./plytix/testauth");
const comparasion = require("./dataProcessing/dataComparison");
const createLog = require("./logs/logs")

/**
 *  Performs synchronization between SAP and Plytix.
 *  Retrieves information from SAP, compares it with the PIM (Plytix), and creates new products in the PIM as needed.
 *  Logs events and errors to a log file.
 *  @returns {Promise<void>} A promise indicating the completion of the synchronization.
 */
async function main() {
    try{
        // Plytix
        const token = await getPlytixToken();
        const pimProducts = await getAllProducts(token);

        // SAP
        const sapProducts = [];
        for (const urlInfo of urls) {
            sapProducts.push(await getProducts(urlInfo))
        };
        
        // Data process
        const newProductsData = await comparasion(pimProducts, sapProducts);

        // Post new product from SAP on the PIM
        const testToken = await getPlytixTokenTest(); // This token will be remove in prod, use just token
        const postPromises = newProductsData.map(productData => postNewProducts(testToken, productData));
        await Promise.all(postPromises);

        // End and log save.
        createLog("Synchronization betwen SAP and Plytix ended");
        return console.log("Synchronization betwen SAP and Plytix ended.");
    }catch(err){
        createLog("Error main: " + err);
        console.log("error main:", err);
        throw new Error(err); 
    };
};

// Init Synchronization
main();