const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, GetOneTodoParams, PutTodoRequest } = definitions;

/**
 * 
 * UPDATE one todo
 * 
 * @param {*} app 
 */

exports.update = (app) => {
    app.put('/todo/:id', {
        schema: {
            description: 'Update a todo',
            tags: ['Todo'],
            summary: 'Update a todo',
            body: PutTodoRequest,
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
         * Updates one todo from the database given a unique ID and a payload
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         * 
         */
        handler: async (request,response) => {
            const { params, body, user } = request;
            const { username} = user;
            const { id } = params;
            // get text and isDone from the body
            const { text, isDone } = body;
            
            // if there is no text or isDone property
            if (!text && (isDone === null || isDone === undefined)) {
                return response
                    .badRequest('request/malformed')
            }

            const oldData = await Todo.findOne({ id, username }).exec();

            if (!oldData) {
                return response
                    .notFound('todo/not-found')
            }

            const update = {};

            if (text) {
                update.text = text;
            }
            if (isDone !== undefined && isDone !== null) {
                update.isDone = isDone;
            }

            update.dateUpdated = new Date().getTime();

            const data = await Todo.findOneAndUpdate(
                { id },
                update,
                { new: true }
            )
                .exec();
        
            return {
                success: true,
                data
            }
        }      
    });
}