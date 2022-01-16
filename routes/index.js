const { todo } = require('./todo');
const { definitions } = require('../definitions');
const { SuccessResponse } = definitions;
/**
 * 
 * @param {*} app 
 */
exports.routes = (app) => {
    // access root address - http://localhost/
    app.get('/', {
        schema: {
            description: 'Server root route',
            tags: ['Root'],
            summary: 'Server root route',
            response: {
                200: SuccessResponse
            }
        },
        /**
         * handles the request for a given route
         */
        handler: async (req) => {
            // response in JSON format
            return { success: true }
        }
    });

    todo(app);
}