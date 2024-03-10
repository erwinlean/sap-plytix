"use strict";

// Normal http request without node-fetch result in "certificate" error, uses node-fetch fix that.
const fetch = require('node-fetch');
const createLog = require("../logs/logs");

// Url for fv and ferrum
const urls = [{
        url: process.env.ferrumUrl,
        name: "Ferrum"
    },{
        url: process.env.fvUrl,
        name: "FV"
    }
];

/**
 *  Retrieves product information from SAP.
 *  @param {string} urlInfo URL information for querying SAP.
 *  @returns {Promise<Object[]>} A promise resolving to an array of objects representing SAP products.
 */
async function getProducts(urlInfo) {
    const { url, name } = urlInfo;
    // Call credentials from .env file
    const username = process.env.username;
    const password = process.env.password;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + Buffer.from(username + ":" + password).toString("base64")
            },
            agent: new (require("https").Agent)({ rejectUnauthorized: false })
        });

        if (response.ok) {
            const products = await response.json();
            const activeProducts = products.EtDatosMaterial.filter(element => {
                if (name === "Ferrum") {
                    return (element.StGralMaterial === "Z4" || element.StGralMaterial === "Z5") && element.Calidad !== "Z2" && element.Marcabaja !== "X";
                } else {
                    return ( element.StOvMaterial === "Z4" || element.StOvMaterial === "") && ( element.Categoria !== "OT" && element.FechaStOv === "0000-00-00" && element.Marcabaja !== "X" );
                }
            });

            return activeProducts
        } else {
            createLog(`Failed to fetch products for ${name}. Status: ${response.status}`)
            throw new Error(`Failed to fetch products for ${name}. Status: ${response.status}`);
        }
    } catch (error) {
        createLog("Error getting products from SAP: " + error.message);
        console.log(error.message);
        throw error;
    }
}

module.exports = {
    getProducts,
    urls
}