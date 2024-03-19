"use strict";

require('dotenv').config();
const createLog = require("../logs/logs");

// Credentials
const apiPasswordTest = process.env.apiPasswordTest;
const apiKeyTest = process.env.apiKeyTest;
const url = process.env.url

/**
 *  Retrieves the Plytix authentication token.
 *  @returns {Promise<string>} A promise resolving to the Plytix authentication token.
 */
const getPlytixTokenTest = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${apiKeyTest}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                api_key: apiKeyTest,
                api_password: apiPasswordTest
            }),
            redirect: 'follow'
        };

        const response = await fetch(url, requestOptions);
        const data = await response.json();

        return data.data[0].access_token;
    } catch (error) {
        createLog("Error fetching Plytix auth token:" + error.message);
        console.log("Error fetching Plytix auth token:" + error.message);
        throw error;
    };
};

module.exports = getPlytixTokenTest;