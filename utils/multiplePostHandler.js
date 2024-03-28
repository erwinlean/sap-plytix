"use strict";

/**
 *  If the new products are more than 10, this function handles the posts with a delay to comply with API limitations.
 *  @param {Function} postFunction Function for creating products on the PIM (Plytix).
 *  @param {string} token Authentication token to access the PIM.
 *  @param {Array<Object>} products Array of all the new products to post.
 *  @returns {Promise<void>} A promise indicating the completion of the posts.
 */
const multiplePosts  = async (postFunction, token, products) => {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        await postFunction(token, product);
        await new Promise(resolve => setTimeout(resolve, 450)); // 3 products for second
    };
};

module.exports = multiplePosts;