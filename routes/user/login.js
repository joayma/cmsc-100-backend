const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { LoginResponse, PostUserRequest } = definitions;

/**
 * route for logging in a user
 * 
 * @param {*} app 
 */

exports.login = (app) => {
 app.post('/login', {
    schema: {
        description: 'Logs in a user',
        tags: ['User'],
        summary: 'Logs in a user',
        body: PostUserRequest,
        response: {
            200: LoginResponse
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
        // only username and password will be checked
        const { username, password} = body;

        if (!username || !password) {
            return response
                .badRequest('request/malformed')
        }

        const user = await User.findOne({username}).exec();

        if(!user) {
            return response
                .unauthorized('auth/no-user');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return response
                .unauthorized('auth/wrond-password');
        }

        const data = app.jwt.sign({
            username
        })

        request.session.token = data;

        return {
            success: true,
            data
        }
    }
 })   
}