"use strict";

const createLog = require("../logs/logs");

/**
 *  Posts new products to the PIM (Plytix) using an authentication token.
 *  @param {string} accessToken Authentication token to access the PIM.
 *  @param {Object} sapData Product data obtained from SAP.
 *  @returns {Promise<Object>} A promise resolving to the posted product data.
 */
const postNewProducts = async (accessToken, sapData) => {
    const postUrl = "https://pim.plytix.com/api/v1/products";

    // Categories id
    // ferrum
    let currentCategories = "65e9aece5b64717916e6e2f2";
    if(sapData.categories === "fv"){
        // fv
        currentCategories = "65e9aecaf7b219a225d086cd";
    };

    try {
        // Schema to send Plytix, matching attributes and SKU required for the creation
        const productData = {
            // SKU
            sku: sapData.Material,
            // Hardcode Attributes codes
            attributes: {
                ean: sapData.Ean,
                linea: sapData.Linea || "",
                // descripcion_sap is, for the PIM the name, not descripcion
                nombre_sap: sapData.Descripcion || "",
                // Check witch one of "marca" is the correct to send the data
                fe_marca: sapData.categories,
                fv_marca: sapData.categories
            },
            // Hardcode categories id depends if is FV or Ferrum
            categories: [{ 
                id: currentCategories
            }],
            // Hardcode the draft status, just in case.
            status: "Draft"
        }

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
            createLog("Product created on Plytix: " + sapData.Material);
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