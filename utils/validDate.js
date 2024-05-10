"use strict";

/**
 *  Check if the date is valid
 *  @param {string} fechaStGral State, date to check
 *  @returns {boolean} Returns boolean if the date is "0000-00-00" or equal/pass date not future
 */
function isStatusValid(fechaStGral) {
    if (fechaStGral === "0000-00-00") {
        // 0000-00-00 as valid date
        return true;
    } else {
        // Check other dates
        const currentDate = new Date();
        const statusDate = new Date(fechaStGral);
        return statusDate <= currentDate;
    }
}

module.exports = isStatusValid;