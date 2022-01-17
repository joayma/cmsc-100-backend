const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserResponse, PostUserRequest } = definitions;
const saltRounds = 10;

/**
 * route for creating a user
 * 
 * @param {*} app 
 */


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
        const { username, firstName, lastName, isAdmin = false, password} = body;

        const user = await User.findOne({username}).exec();

        if (user) {
            return response
                .forbidden('request/username-taken')
        }
        
        var specialCharacters = /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g;
        var numbers = /\d/
        
        // checks if password is less than 12 characters AND has numbers and special characters
        if (password.length < 12 && specialCharacters.test(password) && numbers.test(password)) {
            return response
                .badRequest('request/invalid-password')
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const data = new User ({
            username,
            firstName,
            lastName,
            isAdmin,
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