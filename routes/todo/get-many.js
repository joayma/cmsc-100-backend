const { Todo } = require('../../db');

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
    app.get('/todo', async (request) => {
        const { query } = request
        const { limit = 10, startDate } = query;

        // if there is a startDate, the query should
        // look for the todos with dateUpdated property
        // that is greather than or equal to the startDate
        // else, it will search for all given the limit
        const options = startDate
            ? {
                dateUpdated: {
                    $gte: startDate
                }
            }
            : {};
        
        const data = await Todo
            .find(options)
            .limit(parseInt(limit))
            .sort({
                dateUpdated: -1
            })
            .exec();
    
        return {
            success: true,
            data
        }      
    });
}