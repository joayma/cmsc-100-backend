const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserParams, SuccessResponse } = definitions;
/**
 * 
 * DELETE one user
 * 
 * @param {*} app 
 */

exports.deleteOne = (app) => {
    app.delete('/user/:id', {
        schema: {
            description: 'Delete a user',
            tags: ['User'],
            summary: 'Delete a user',
            params: GetOneUserParams,
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
         * Deletes one todo from the database given a unique ID
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         * 
         */
        handler: async (request,response) => {
            const { params, user } = request;
            const { username, isAdmin} = user;
            const { id } = params;
            
            const data = await User.findOneAndDelete({ username: id }).exec();

            if (!data) {
                return response
                    .notFound('user/not-found')
            }

            // if current user is not an admin or is not the account owner
            if (isAdmin === false && username !== id ) {
                return response
                    .unauthorized('auth/unauthorized');
            }
        
            return {
                success: true,
            }
        }      
    })
}