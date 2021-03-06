const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoParams, SuccessResponse } = definitions;
/**
 * 
 * DELETE one todo
 * 
 * @param {*} app 
 */

exports.deleteOne = (app) => {
    app.delete('/todo/:id', {
        schema: {
            description: 'Delete one todo',
            tags: ['Todo'],
            summary: 'Delete one todo',
            params: GetOneTodoParams,
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
            const { username} = user;
            const { id } = params;
            
            const data = await Todo.findOneAndDelete({ id, username }).exec();

            if (!data) {
                return response
                    .notFound('todo/not-found')
            }
        
            return {
                success: true,
            }
        }      
    })
}