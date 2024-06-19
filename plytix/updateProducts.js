"use strict";

const createLog = require("../logs/logs");
const fetch = require('node-fetch');

/**
 *  Update new products Attributes to the PIM (Plytix) using an authentication token.
 *  @param {string} accessToken Authentication token to access the PIM.
 * *@param {string} id id of the product to Update.
 *  @param {Object} sapData Product data obtained from SAP.
 *  @returns {Promise<Object>} A promise resolving to the posted product data.
 */

// TO REVIEW THE UPDATE FUNC COMPLETE
const updateProductsData = async (accessToken, id, sapData) => {
    const updateProductsUrl = "https://pim.plytix.com/api/v1/products/" + id;

    try {
        let productData;
        if(sapData.Categories === "Fv"){
            // Divide Fv and Novum
            if(sapData.Material.toLowerCase().startsWith("fr")){
                productData = {
                    attributes: {
                        fv_nombre_sap: sapData.Descripcion || "",
                    }
                };
            }else{
                productData = {
                    attributes: {
                        fv_nombre_sap: sapData.Descripcion || "",
                    }
                };
            }
        } else if (sapData.Categories === "Ferrum"){
            productData = {
                attributes: {
                    fe_nombre_sap: sapData.Descripcion || "",
                }
            };
        }

        // Post request
        const requestOptions = {
            method: "PATCH",
            headers: {  
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        };

        const response = await fetch(updateProductsUrl, requestOptions);
        const data = await response.json();

        if (response.ok) {
            createLog("Product updated on Plytix: " + JSON.stringify(sapData));
            return data;
        } else {
            createLog("Error updating attributes on response: " + data.error.msg + " " + sapData.Material);
            return;
        }

        return;
    } catch (err) {
        createLog("Error updating attributes: " + err.message);
        console.log("Error updating attributes:" + err.message);
        throw err;
    }
};

module.exports = updateProductsData;