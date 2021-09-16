const { Todo } = require('../../db');

/**
 * 
 * DELETE one todo
 * 
 * @param {*} app 
 */

exports.deleteOne = (app) => {
    /**
     * Deletes one todo from the database given a unique ID
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     * 
     */
    app.delete('/todo/:id', async (request,response) => {
        const { params } = request;
        const { id } = params;
        
        const data = await Todo.findOneAndDelete({ id }).exec();

        if (!data) {
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not-found',
                    message: 'Todo doesn\'t exist.'
                })
        }
    
        return {
            success: true,
        }      
    });
}