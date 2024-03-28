"use strict";

/**
 *  This file, just have the const, functions and consts needed for the main operates.
*/

// Imports
const { getProducts, urls } = require("./sap/getProducts");
const getAllProducts = require("./plytix/getProducts");
const getPlytixToken = require("./plytix/auth");
const postNewProducts = require("./plytix/postProducts");
const getPlytixTokenTest = require("./plytix/testauth");
const comparasion = require("./dataProcessing/dataComparison");
const multiplePosts = require("./utils/multiplePostHandler.js");
const createLog = require("./logs/logs");
const checkMemory = require("./CPU/memory");

module.exports = {
    getProducts,
    urls,
    getAllProducts,
    getPlytixToken,
    postNewProducts,
    getPlytixTokenTest,
    comparasion,
    multiplePosts,
    createLog,
    checkMemory
};