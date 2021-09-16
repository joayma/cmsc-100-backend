const { Todo } = require('../../db');

/**
 * 
 * UPDATE one todo
 * 
 * @param {*} app 
 */

exports.update = (app) => {
    /**
     * Updates one todo from the database given a unique ID and a payload
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     * 
     */
    app.put('/todo/:id', async (request,response) => {
        const { params, body } = request;
        const { id } = params;
        // get text and isDone from the body
        const { text, isDone } = body || {};
        
        // if there is no text or isDone property
        if (!text && (isDone === null || isDone === undefined)) {
            return response
                .code(400)
                .send({
                    success: false,
                    code: 'todo/malformed',
                    message: 'Payload doesn\'t have text property.'
                })
        }

        const oldData = await Todo.findOne({ id }).exec();

        if (!oldData) {
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not-found',
                    message: 'Todo doesn\'t exist.'
                })
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
    });
}