const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoParams, GetOneTodoResponse } = definitions;

/**
 * 
 * GET one todo
 * 
 * @param {*} app 
 */

exports.get = (app) => {
    app.get('/todo/:id', {
        schema: {
            description: 'Get a todo',
            tags: ['Todo'],
            summary: 'Get a todo',
            params: GetOneTodoParams,
            response: {
                200: GetOneTodoResponse
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
            const { username, isAdmin} = user;
            const { id } = params;

            const data = await Todo.findOne({ id }).exec();

            // if todo does not exist
            if (!data) {
                return response
                .notFound('todo/not-found')
            }
            
            // if logged user is not an admin or is not the account owner
            if (!isAdmin &&  username !== data.username) {
                return response
                    .unauthorized('auth/unauthorized');
            }

        
            return {
                success: true,
                data
            };
        }      
    });
}