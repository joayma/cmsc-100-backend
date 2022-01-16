const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserResponse, PostUserRequest } = definitions;
const saltRounds = 10;


exports.create = (app) => {
 app.post('/user', {
    schema: {
        description: 'Create a user',
        tags: ['User'],
        summary: 'Create a user',
        body: PostUserRequest,
        response: {
            200: GetOneUserResponse
        }
    },
     /**
     * handles the request for a given route
     * 
     *  @param {import('fastify').FastifyRequest} request
     *  @param {import('fastify').FastifyReply<Response>} response
     */

    handler: async (request, response) => {
        const { body } = request;
        const { username, firstName, lastName, password} = body;

        const hash = await bcrypt.hash(password, saltRounds);

        const data = new User ({
            username,
            firstName,
            lastName,
            password: hash
        });

        await data.save();

        return {
            success: true,
            data
        }
    }
 })   
}