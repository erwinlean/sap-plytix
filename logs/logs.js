"use strict";

const fs = require("fs");
const path = require("path");

/**
 *  Logs events and errors to a log file.
 *  @param {string} data Data to log to the log file.
 */
const createLog = (data) => {
    const logFilePath = path.join(__dirname, "logs.txt");

    try {
        const date = new Date().toLocaleString();
        const logMessage = date + " - " + data + "\n";
        
        fs.appendFileSync(logFilePath, logMessage);

    } catch (error) {
        console.error('Error writing to log file:', error);
        throw error;
    }
}

module.exports = createLog;