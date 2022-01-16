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
        }
    },
     /**
     * handles the request for a given root
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     */

    handler: async (request, response) => {
        const { body } = request;
        const { text, isDone = false} = body;

        // if (!text) {
        //     return response
        //         .code(400)
        //         .send({
        //             success: false,
        //             code: 'todo/malformed',
        //             message: 'Payload doesn\'t have text property.'
        //         })
        // }

        const data = new Todo ({
            text,
            isDone,
        });

        await data.save();

        return {
            success: true,
            data
        }
    }
 })   
}