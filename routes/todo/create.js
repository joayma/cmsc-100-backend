const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, PostTodoRequest } = definitions;


exports.create = (app) => {
 app.post('/todo', {
    schema: {
        description: 'Create a todo',
        tags: ['Todo'],
        summary: 'Create a todo',
        body: PostTodoRequest,
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
     * handles the request for a given root
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     */

    handler: async (request, response) => {
        const { body, user } = request;
        const { text, isDone = false} = body;
        const { username } = user;


        const data = new Todo ({
            text,
            isDone,
            username,
        });

        await data.save();

        return {
            success: true,
            data
        }
    }
 })   
}