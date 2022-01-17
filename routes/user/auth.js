const { definitions } = require('../../definitions');
const { SuccessResponse } = definitions;

/**
 * route for checking if user is authenticated
 * 
 * @param {*} app 
 */

exports.auth = (app) => {
 app.get('/auth', {
    schema: {
        description: 'Check user authentication',
        tags: ['User'],
        summary: 'Check user authentication',
        response: {
            200: SuccessResponse
        },
        security: [
            {
                bearer: []
            }
        ]
    },
    preHandler: app.auth([
        app.verifyJWT
    ]),
     /**
     * handles the request for a given route
     * 
     */

    handler: async () => {
        return {
            success: true
        }
    }
 })   
}