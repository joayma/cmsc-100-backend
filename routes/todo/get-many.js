const { getTodos } = require('../../lib/get-todos');
const { join } = require('path');

/**
 * 
 * GET many todos
 * 
 * @param {*} app 
 */

exports.getMany = (app) => {
    /**
     * Gets the todos from the database
     * 
     *  @param {import('fastify').FastifyRequest} request
     */
    app.get('/todo', (request) => {
        const { query } = request
        const { limit = 10, startDate } = query;
        const filename = join(__dirname, '../../database.json');
        const encoding = 'utf8';
        const todos = getTodos(filename, encoding);
        const data = [];

        if (!startDate) {
            // If there is no startDate, sort todos in ascending order according to the dateUpdated
            todos.sort((prev, next) => next.dateUpdated - prev.dateUpdated);
        } else {
            // sort todos in ascending order according to the dateUpdated
            todos.sort((prev, next) => prev.dateUpdated - next.dateUpdated);
        }
    
        for (const todo of todos) {
            // If there is no startDate (which is default) or
            // the todo.dateUpdated is equal or before the startDate,
            // then do inside
            if (!startDate || startDate <= todo.dateUpdated) {
                if (data.length < limit) {
                    data.push(todo);
                }
            }
        }

        // sorts the data in descending order according to the dateUpdated
        data.sort((prev, next) => next.dateUpdated - prev.dateUpdated);
    
        return {
            success: true,
            data
        }      
    });
}