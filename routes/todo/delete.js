const { getTodos } = require('../../lib/get-todos');
const { writeFileSync } = require('fs');
const { join } = require('path');

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
    app.delete('/todo/:id', (request,response) => {
        const { params } = request;
        const { id } = params;
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

        todos.splice(index, 1);

        const newDatabaseStringContents = JSON.stringify({ todos }, null, 2);
        writeFileSync(filename, newDatabaseStringContents, encoding);
    
        return {
            success: true,
        }      
    });
}