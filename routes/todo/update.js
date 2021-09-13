const { getTodos } = require('../../lib/get-todos');
const { writeFileSync } = require('fs');
const { join } = require('path');

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
    app.put('/todo/:id', (request,response) => {
        const { params, body } = request;
        const { id } = params;
        // get text and isDone from the body
        const { text, isDone } = body || {};
        
        const filename = join(__dirname, '../../database.json');
        const encoding = 'utf8';
        const todos = getTodos(filename, encoding);

        const index = todos.findIndex(todo => todo.id === id);

        if (index < 0) {
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not-found',
                    message: 'Todo doesn\'t exist.'
                })
        }

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

        const data = todos[index];

        if (text) {
            data.text = text;
        }
        if (isDone) {
            data.isDone = isDone;
        }
        todos[index] = data;

        const newDatabaseStringContents = JSON.stringify({ todos }, null, 2);
        writeFileSync(filename, newDatabaseStringContents, encoding);
    
        return {
            success: true,
            data
        }      
    });
}