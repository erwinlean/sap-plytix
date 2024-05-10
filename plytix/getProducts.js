"use strict";

const createLog = require("../logs/logs");
const fetch = require('node-fetch');

/**
 *  Retrieves all products from the PIM (Plytix) using an authentication token.
 *  @param {string} token Authentication token to access the PIM.
 *  @returns {Promise<Object[]>} A promise resolving to an array of objects representing PIM products.
 */
const getAllProducts = async (token) => {
  const url_get_products = "https://pim.plytix.com/api/v1/products/search";

  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    let allProducts = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const requestBody = {
        pagination: {
          page: currentPage,
          page_size: 100,
          order: "asc/label"
        },
        attributes: [
          "attributes.fv_nombre_sap",
          "attributes.fe_nombre_sap",
      ],
      };

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: "follow"
      };

      const response = await fetch(url_get_products, requestOptions);
      const data = await response.json();

      // Add products from current page to the array
      allProducts = allProducts.concat(data.data);

      // Update totalPages if it"s not already set
      if (totalPages === 1) {
        totalPages = Math.ceil(data.pagination.total_count / 100);
      }

      currentPage++;
    };

    return allProducts;
  } catch (error) {
    createLog("Error getting Plytix product IDs:" + error.message);
    console.log("Error getting Plytix product IDs:" + error.message);
    throw error;
  }
};

module.exports = getAllProducts;
