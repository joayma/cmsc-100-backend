/**
 * 
 * @param {*} app 
 */
exports.routes = (app) => {
    // access root address - http://localhost/
    app.get('/', {
        /**
         * handles the request for a given root
         */
        handler: async (req) => {
            // response in JSON format
            return { success: true }
        }
    });

}