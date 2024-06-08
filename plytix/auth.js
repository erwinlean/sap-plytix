"use strict";

const createLog = require("../logs/logs");
const fetch = require('node-fetch');

// Credentials
const apiPassword = "";
const apiKey = "";
const url = "https://auth.plytix.com/auth/api/get-token";

/**
 *  Retrieves the Plytix authentication token.
 *  @returns {Promise<string>} A promise resolving to the Plytix authentication token.
 */
const getPlytixToken = async () => {
    try {

        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type" :"application/json"
            },
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