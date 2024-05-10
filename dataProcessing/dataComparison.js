"use strict";

const createLog = require("../logs/logs");

/**
 *  Compares products obtained from the PIM (Plytix) with products obtained from SAP.
 *  @param {Object[]} pimProducts Products obtained from the PIM.
 *  @param {Object[]} sapProducts Products obtained from SAP.
 *  @returns {Promise<Object[]>} A promise resolving to an array of objects representing new product data.
 */
const comparasionForNewProduct = async (pimData, sapData) => {
  try {
    // All SKU on SAP
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
        if (nonMatchingSKUs.includes(sapProduct.Material)) {
          sapProduct.Categories = i === 0 ? "Ferrum" : "Fv";
          newProductsData.push(sapProduct);
        };
      };
    };

    createLog("Total of matching SKU from SAP/Plytix fv + ferrum: " + matchingSKUs.length);
    createLog("New materials/Products on SAP in comparation to Plytix: " + nonMatchingSKUs.length);
    createLog(JSON.stringify(nonMatchingSKUs));

    return newProductsData;
  } catch (error) {
    createLog("Error proccesing data for create new product: " + error.message);
    throw error;
  }
};

const comparasionForAttributesUpdate = async (pimData, sapData) => {
  try {
    // All SKU on SAP
    const sapSku = [];
    for (let i = 0; i < sapData.length; i++) {
      const ele = sapData[i];
      for (let j = 0; j < ele.length; j++) {
        const element = ele[j];
        sapSku.push(element.Material);
      }
    }

    // All SKU on Plytix
    const plytixSku = pimData.map(element => element.sku);

    // Find SKUs that exist in both SAP and Plytix
    const matchingSKUs = sapSku.filter(sku => plytixSku.includes(sku));

    // Complete data of the matching sku from sapData and plytix (assign category)
    const productData = []
    for (let i = 0; i < sapData.length; i++) {
      const ele = sapData[i];
      for (let j = 0; j < ele.length; j++) {
        const sapProduct = ele[j];
        // Asign category
        if (matchingSKUs.includes(sapProduct.Material)) {
          sapProduct.Categories = i === 0 ? "Ferrum" : "Fv";
          // Check if the sku is equal and the descripcion (attributes isnt) need to be update the attribute on Plytix
          for (let l = 0; l < pimData.length; l++) {
            const pimProduct = pimData[l];
            if(sapProduct.Categories === "Fv"){
              if(pimProduct.sku === sapProduct.Material && pimProduct.attributes.fv_nombre_sap !== sapProduct.Descripcion){
                sapProduct.plytixId = pimProduct.id;
                productData.push(sapProduct);
              };
            }else if(sapProduct.Categories === "Ferrum"){
              if(pimProduct.sku === sapProduct.Material && pimProduct.attributes.fe_nombre_sap !== sapProduct.Descripcion){
                sapProduct.plytixId = pimProduct.id;
                productData.push(sapProduct);
              };             
            };
          };
        };
      };
    };

    createLog("Total products with diferent attributes: " + productData.length);
    createLog(JSON.stringify(productData))

    return productData;
  } catch (error) {
    createLog("Error proccesing data for update attributes: " + error.message);
    throw error;
  }
};

module.exports = {comparasionForNewProduct, comparasionForAttributesUpdate};
