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

    try {
        // Ferrum categories
        let categoryId = "65e9aece5b64717916e6e2f2";
        let categoryLabelFerrum = "Ferrum";
        let categoryLabelFv = "";
        if(sapData.Categories === "Fv"){
        // FV categories
            categoryId = "65e9aecaf7b219a225d086cd";
            categoryLabelFerrum = "";
            categoryLabelFv = "Fv";
        };

        // Schema to send Plytix, matching attributes and SKU required for the creation
        const productData = {
            // SKU
            sku: sapData.Material,
            // Hardcode Attributes codes
            attributes: {
                ean: sapData.Ean || "",
                linea: sapData.Linea || "",
                // descripcion_sap is, for the PIM the name, not descripcion
                nombre_sap: sapData.Descripcion || "",
                // Marca on plytix fe (is ferrum) and fv, one or another.
                fe_marca: categoryLabelFerrum,
                fv_marca: categoryLabelFv
            },
            // Hardcode categories id depends if is FV or Ferrum
            categories: [{ 
                id: categoryId
            }],
            // Hardcode the draft status.
            status: "Draft"
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