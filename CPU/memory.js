"use strict";

const os = require('os-utils');
const createLog = require("../logs/logs");

// Format memory usage
const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

/**
 *  Check memory usage.
 *  @returns {Object} Object of memory usage information.
 */
function checkMemory() {
    // Monitoring CPU
    const startCpuUsage = process.cpuUsage();

    // Calculate CPU usage & memory usage
    const endCpuUsage = process.cpuUsage(startCpuUsage);
    createLog('CPU usage (%):');
    createLog(endCpuUsage.user / 1000)

    const endMemoryUsage = process.memoryUsage();
    const memoryUsage = {
        // Resident Set Size - total memory allocated for the process execution
        rss: `${formatMemoryUsage(endMemoryUsage.rss)}`,
        // total size of the allocated
        heapTotal: `${formatMemoryUsage(endMemoryUsage.heapTotal)}`,
        // actual memory used during the execution
        heapUsed: `${formatMemoryUsage(endMemoryUsage.heapUsed)}`,
        // V8 external memory
        external: `${formatMemoryUsage(endMemoryUsage.external)}`
    };

    createLog('Memory usage:');
    createLog(JSON.stringify(memoryUsage));

    return memoryUsage;
}

module.exports = checkMemory;