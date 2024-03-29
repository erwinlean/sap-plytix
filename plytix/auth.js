"use strict";

require('dotenv').config();
const createLog = require("../logs/logs");

// Credentials
const apiPassword = process.env.apiPassword;
const apiKey = process.env.apiKey;
const url = process.env.url

/**
 *  Retrieves the Plytix authentication token.
 *  @returns {Promise<string>} A promise resolving to the Plytix authentication token.
 */
const getPlytixToken = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${apiKey}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                api_key: apiKey,
                api_password: apiPassword
            }),
            redirect: 'follow'
        };

        const response = await fetch(url, requestOptions);
        const data = await response.json();

        return data.data[0].access_token;
    } catch (error) {
        createLog("Error fetching Plytix auth token:" + error.message);
        console.log(error);
        throw error;
    };
};

module.exports = getPlytixToken;