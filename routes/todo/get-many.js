const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetManyTodoResponse, GetManyTodoQuery } = definitions;
/**
 * 
 * GET many todos
 * 
 * @param {*} app 
 */

exports.getMany = (app) => {
    app.get('/todo', {
        schema: {
            description: 'Gets many todos',
            tags: ['Todo'],
            summary: 'Gets many todos',
            query: GetManyTodoQuery,
            response: {
                200: GetManyTodoResponse
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
         */
        handler: async (request) => {
            const { query, user } = request;
            const { username} = user;
            const { limit = 10, startDate, endDate } = query;

            const options = {
                username
            };

            if (startDate) {
                options.dateUpdated = {};
                options.dateUpdated.$gte = startDate;
            }

            if (endDate) {
                options.dateUpdated = options.dateUpdated || {};
                options.dateUpdated.$lte = endDate;
            }

            const data = await Todo
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