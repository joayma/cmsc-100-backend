const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetManyUserResponse, GetManyUserQuery } = definitions;
/**
 * 
 * GET many users
 * 
 * @param {*} app 
 */

exports.getMany = (app) => {
    app.get('/user', {
        schema: {
            description: 'Gets many users',
            tags: ['User'],
            summary: 'Gets many users',
            query: GetManyUserQuery,
            response: {
                200: GetManyUserResponse
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
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         * 
         */
        handler: async (request, response) => {
            const { query, user } = request;
            const { username, isAdmin} = user;
            const { limit = 10, startDate, endDate } = query;

            const options = {
                // username
            };

            // if current user is not an admin, return an error
            if (isAdmin === false) {
                return response
                    .unauthorized('auth/unauthorized');
            }

            if (startDate) {
                options.dateUpdated = {};
                options.dateUpdated.$gte = startDate;
            }

            if (endDate) {
                options.dateUpdated = options.dateUpdated || {};
                options.dateUpdated.$lte = endDate;
            }

            const data = await User
                .find(options)
                .limit(parseInt(limit))
                .sort({
                    // starts the query on starDate if startDate exists
                    dateUpdated: startDate && !endDate ? 1 : -1
                })
                .exec();
            
            // sorts todos in descending order
            if (startDate && !endDate) {
                data.sort((prev, next) => next.dateUpdated - prev.dateUpdated);
            }
        
            return {
                success: true,
                data
            }      
        }
    });
}