"use strict";

const createLog = require("../logs/logs");
const fetch = require('node-fetch');

/**
 *  Posts new products to the PIM (Plytix) using an authentication token.
 *  @param {string} accessToken Authentication token to access the PIM.
 *  @param {Object} sapData Product data obtained from SAP.
 *  @returns {Promise<Object>} A promise resolving to the posted product data.
 */
const postNewProducts = async (accessToken, sapData) => {
    const postUrl = "https://pim.plytix.com/api/v1/products";

    try {
        let productData;
        if(sapData.Categories === "Fv"){
            productData = {
                sku: sapData.Material,
                attributes: {
                    fv_ean: sapData.Ean || "",
                    fv_nombre_sap: sapData.Descripcion || "",
                    fv_marca: "FV"
                },
                categories: [{ 
                    id: "651b17a155f5d6567db38f7d"
                }],
                status: "Draft"
            };
        } else if (sapData.Categories === "Ferrum"){
            productData = {
                sku: sapData.Material,
                attributes: {
                    fe_ean: sapData.Ean || "",
                    fe_nombre_sap: sapData.Descripcion || "",
                    fe_marca: "Ferrum"
                },
                categories: [{ 
                    id: "651b17989803c883157173cb"
                }],
                status: "Draft"
            };
        };

        // Post request
        const requestOptions = {
            method: "POST",
            headers: {  
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        };

        const response = await fetch(postUrl, requestOptions);
        const data = await response.json();

        if (response.ok) {
            createLog("Product created on Plytix: " + JSON.stringify(sapData));
            return data;
        } else {
            createLog("Error posting new products on response: " + data.error.msg + " " + sapData.Material);
        }
    } catch (err) {
        createLog("Error posting new products: " + err.message);
        console.log("Error posting new products:" + err.message);
        throw err;
    }
};

module.exports = postNewProducts;