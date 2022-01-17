const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserResponse, GetOneUserParams, PutUserRequest } = definitions;
const saltRounds = 10;

/**
 * 
 * UPDATE one user
 * 
 * @param {*} app 
 */

exports.update = (app) => {
    app.put('/user/:id', {
        schema: {
            description: 'Update a user',
            tags: ['User'],
            summary: 'Update a user',
            body: PutUserRequest,
            params: GetOneUserParams,
            response: {
                200: GetOneUserResponse
            },
            security: [
                {
                    bearer: []
                }
            ]
        },
        preHandler: app.auth([
            app.verifyJWT
        ]),

        /**
         * Updates one user from the database given a unique ID and a payload
         * 
         *  @param {import('fastify').FastifyRequest} request
         *  @param {import('fastify').FastifyReply<Response>} response
         * 
         */
        handler: async (request,response) => {
            const { params, body, user } = request;
            const { id } = params;
            const { firstName, lastName, isAdmin, password } = body;
            const userAdmin = user.isAdmin;
            const username = user.username;
            
            // if there is no firstName, lastName or password property
            if (!firstName && !lastName && !password) {
                return response
                    .badRequest('request/malformed')
            }
            // if current user is not an admin or is updating a different user
            if (userAdmin === false && username !== id ) {
                return response
                    .unauthorized('auth/unauthorized');
            }
            // if logged user is not an admin and they are trying to change their isAdmin property
            if (userAdmin === false && isAdmin !== false) {
                return response
                    .forbidden('auth/unauthorized-update')
            }
            // if an admin tries to change their firstname or lastname
            if (userAdmin === true && (lastName !== user.lastName || firstName !== user.firstName) ) {
                return response
                    .unauthorized('auth/unauthorized-update');
            }

            const oldData = await User.findOne({ username: id }).exec();
            console.log(oldData);

            if (!oldData) {
                return response
                    .badRequest('user/not-found')
            }

            const update = {};
            // an admin can only change their isAdmin and password.
            if (firstName && userAdmin === false) {
                update.firstName = firstName;
            }
            if (lastName && userAdmin === false) {
                update.lastName = lastName;
            }
            if (isAdmin !== undefined && isAdmin !== null) {
                update.isAdmin = isAdmin;
            }
            if (password) {
                var specialCharacters = /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g;
                var numbers = /\d/
                
                // checks if password is less than 12 characters AND has numbers and special characters
                if (password.length < 12 && specialCharacters.test(password) && numbers.test(password)) {
                    return response
                        .badRequest('request/invalid-password')
                }

                const hash = await bcrypt.hash(password, saltRounds);
                update.password = hash;
            }

            update.dateUpdated = new Date().getTime();
            let data = await User.findOneAndUpdate(
                { username: id },
                update,
                { new: true }
            )
                .exec();

            if (userAdmin) {
                data = {
                    isAdmin: update.isAdmin,
                    dateUpdated: update.dateUpdated,
                    dateCreated: oldData.dateCreated
                }
            }

        
            return {
                success: true,
                data
            }
        }      
    });
}