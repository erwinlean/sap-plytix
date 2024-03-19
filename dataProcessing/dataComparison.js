"use strict";

const createLog = require("../logs/logs");

/**
 *  Compares products obtained from the PIM (Plytix) with products obtained from SAP.
 *  @param {Object[]} pimProducts Products obtained from the PIM.
 *  @param {Object[]} sapProducts Products obtained from SAP.
 *  @returns {Promise<Object[]>} A promise resolving to an array of objects representing new product data.
 */
const comparasion = async (pimData, sapData) => {
    try {
        // All the sku (materials for SAP)
        const sapSku = [];
        for (let i = 0; i < sapData.length; i++) {
            const ele = sapData[i];
            for (let j = 0; j < ele.length; j++) {
                const element = ele[j];
                sapSku.push(element.Material);
            }
        }
        createLog("Total skus from SAP: " + sapSku.length);

        // All SKU on Plytix
        const plytixSku = pimData.map(element => element.sku);
        createLog("Total skus from Plytix: " + plytixSku.length);

        // Find SKUs that exist in both SAP and Plytix
        const matchingSKUs = sapSku.filter(sku => plytixSku.includes(sku));
        createLog("Total of matching SKU from SAP/Plytix: " + matchingSKUs.length);

        const nonMatchingSKUs = [];
        // If Plytix sku is diferent than the sku of sapSku, is pushed to nonMatchingSKUs
        for (const sku of sapSku) {
            if (!plytixSku.includes(sku)) {
                nonMatchingSKUs.push(sku);
            }
        }
        createLog("Total of No matching SKU from SAP/Plytix: " + nonMatchingSKUs.length);

        // Complete data of the non-matching sku from sapData
        const newProductsData = []
        for (let i = 0; i < sapData.length; i++) {
            const ele = sapData[i];
            for (let j = 0; j < ele.length; j++) {
                const sapProduct = ele[j];
                // Asign category
                if(nonMatchingSKUs.includes(sapProduct.Material)){
                    sapProduct.categories = i === 0 ? "Fv" : "Ferrum";
                    newProductsData.push(sapProduct);
                }
            }
        }

        console.log(newProductsData)
        console.log(nonMatchingSKUs)
        createLog("New materials/Products on SAP in comparation to Plytix: " + nonMatchingSKUs.length);
        return newProductsData;
    } catch (error) {
        createLog("Error proccesing data: " + error.message);
        console.log("Error proccesing data: " + error.message);
        throw error;
    }
};

module.exports = comparasion;