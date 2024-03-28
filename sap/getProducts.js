"use strict";

// Normal http request without node-fetch result in "certificate" error, uses node-fetch isntead.
const fetch = require("node-fetch");
const createLog = require("../logs/logs");
const isStatusValid = require("../utils/validDate");
const guardarProductosJSON = require("../logs/jsoncreate");

require('dotenv').config();

// Url for fv and ferrum
const urls = [{
  url: process.env.ferrumUrl,
  name: "Ferrum"
}, {
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
      // Filter active products
      const activeProducts = [];
      for (let i = 0; i < products.EtDatosMaterial.length; i++) {
        const product = products.EtDatosMaterial[i];

        if (name === "FV") {
          // First filter for FV status code:
          if ((product.StGralMaterial === "Z4" || product.StGralMaterial === "") && isStatusValid(product.FechaStGral)) {
            // Second filter for FV, by categories
            if (product.Categoria !== "DA" && product.Categoria !== "OT") {
              // Third filter for Ferrum, By stable (Marcabaja) & bad quality (Calidad)
              if (product.Marcabaja !== "X" && product.Calidad !== "Z2") {
                let productOK = product;
                activeProducts.push(productOK);
              };
            };
          };

        } else if (name === "Ferrum") {
          // First filter for Ferrum, status code
          if ((product.StGralMaterial === "Z4" || product.StGralMaterial === "Z5" || product.StOvMaterial == "Z4") && isStatusValid(product.FechaStGral)) {
            // Second filter for Ferrum, by categories
            if (product.Categoria !== "DA" && product.Categoria !== "OT") {
              // Third filter for Ferrum, By stable (Marcabaja) & bad quality (Calidad)
              if (product.Marcabaja !== "X" && product.Calidad !== "Z2") {
                let productOK = product;
                activeProducts.push(productOK);
              };
            };
          };
        };
      };

      // Log
      if (name === "FV") {
        createLog("Total FV products: " + products.EtDatosMaterial.length);
        createLog("Active FV products: " + activeProducts.length)
        // In case need to see the Sku actives from FV uncoment...
        // createLog("SKU Activos ferrum: ")
        // activeProducts.forEach(element => {
        //   createLog(element.Material);
        // });
      } else if (name === "Ferrum") {
        createLog("Total Ferrum products: " + products.EtDatosMaterial.length);
        createLog("Active Ferrum products: " + activeProducts.length);
        // In case need to see the Sku actives from Ferrum uncoment...
        // createLog("SKU Activos ferrum: ")
        // activeProducts.forEach(element => {
        //   createLog(element.Material);
        // });
      }

      // save all the products as json
      guardarProductosJSON(products.EtDatosMaterial);

      return activeProducts
    } else {
      createLog(`Failed to fetch products for ${name}. Status: ${response.status}`)
      throw new Error(`Failed to fetch products for ${name}. Status: ${response.status}`);
    }
  } catch (error) {
    createLog("Error getting products from SAP: " + error.message);
    console.log(error.message);
    throw error;
  };
};

module.exports = {
  getProducts,
  urls
};
