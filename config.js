"use strict";

/**
 *  This file, just have the const, functions and consts needed for the main operates.
*/

// Imports
const { getProducts, urls } = require("./sap/getProducts");
const getAllProducts = require("./plytix/getProducts");
const getPlytixToken = require("./plytix/auth");
const postNewProducts = require("./plytix/postProducts");
const updateProductsData = require("./plytix/updateProducts.js");
const {comparasionForNewProduct, comparasionForAttributesUpdate} = require("./dataProcessing/dataComparison");
const multiplePosts = require("./utils/multipleReqHandler.js");
const createLog = require("./logs/logs");
const checkMemory = require("./CPU/memory");

module.exports = {
    getProducts,
    urls,
    getAllProducts,
    getPlytixToken,
    postNewProducts,
    updateProductsData,
    comparasionForNewProduct,
    comparasionForAttributesUpdate,
    multiplePosts,
    createLog,
    checkMemory
};