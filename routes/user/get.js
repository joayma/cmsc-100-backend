const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserParams, GetOneUserResponse } = definitions;

/**
 * 
 * GET one user
 * 
 * @param {*} app 
 */

exports.get = (app) => {
    app.get('/user/:id', {
        schema: {
            description: 'Get a user',
            tags: ['User'],
            summary: 'Get a user',
            params: GetOneUserParams,
            response: {
                200: GetOneUserResponse
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
         * Get one todo from the database given a unique ID
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         * 
         */
        handler: async (request,response) => {
            const { params, user } = request;
            const { username, isAdmin } = user;
            const { id } = params;

            const data = await User.findOne({ username: id }).exec();

            // if current user's username is different from the username they are searching, 
            // return an error
            if (isAdmin === false && username !== id ) {
                return response
                    .unauthorized('auth/unauthorized');
            }

            if (!data) {
                return response
                    .badRequest('user/not-found')
            }
        
            return {
                success: true,
                data
            };
        }      
    });
}