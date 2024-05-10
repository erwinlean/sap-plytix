"use strict";

/**
 *  If the new products are more than 10, this function handles the posts with a delay to comply with API limitations.
 *  @param {Function} plytixFunction Function for creating/update products on the PIM (Plytix).
 *  @param {string} token Authentication token to access the PIM.
 *  @param {Array<Object>} products Array of all the new products to post.
 *  @param {string|null} [id] Optional ID parameter of the product.
 *  @returns {Promise<void>} A promise indicating the completion of the posts.
 */
const multiplePosts  = async (plytixFunction, getTokenFunction, products, toUpdate = null) => {
    let token = await getTokenFunction();
    let lastTokenTime = Date.now();

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let id;
        const currentTime = Date.now();
        
        if (currentTime - lastTokenTime >= 3 * 60 * 1000) {
            token = await getTokenFunction();
            lastTokenTime = currentTime;
        };
        
        if (toUpdate && product.plytixId) {
            id = product.plytixId;
            await plytixFunction(token, id, product);
        } else {
            await plytixFunction(token, product);
        };

        await new Promise(resolve => setTimeout(resolve, 750));
    };
};

module.exports = multiplePosts;