const { v4:uuid } = require('uuid');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

exports.create = (app) => {
 app.post('/todo', {
     /**
     * handles the request for a given root
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     */

    handler: async (request, response) => {
        const id = uuid();
        const { body } = request;
        const { text, isDone = false} = body || {};

        if (!text) {
            return response
                .code(400)
                .send({
                    success: false,
                    code: 'todo/malformed',
                    message: 'Payload doesn\'t have text property.'
                })
        }

        const filename = join(__dirname, '../../database.json');
        const encoding = 'utf8';

        const databaseStringContents = readFileSync(filename, encoding);
        const database = JSON.parse(databaseStringContents);

        const data = {
            id,
            text,
            isDone,
            dateCreated: new Date().getTime(),
            dateUpdated: new Date().getTime()
        }

        database.todos.push(data);

        const newDatabaseStringContents = JSON.stringify(database, null, 2);
        writeFileSync(filename, newDatabaseStringContents, encoding);

        return {
            success: true,
            data
        }
    }
 })   
}