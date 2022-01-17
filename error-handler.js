/**
* 
* @param {Error} error 
* @param {import('fastify').FastifyRequest} request
* @param {import('fastify').FastifyReply<Response>} response
*/
exports.errorHandler = (error, request, response) => {
    let statusCode = error.statusCode || 500;
    let errorCode = error.message;
    let errorMessage = error.message;

    console.log(statusCode);

    const errors = {
        'todo/not-found': 'Todo does not exist.',
        'request/malformed': 'Payload doesn\'t have the required properties.',
        'auth/wrond-password': 'Incorrect password.',
        'auth/no-authorization-header': 'Authorization header not found.',
        'auth/no-user': 'User does not exist.',
        'auth/expired': 'Token has expired.',
        'auth/unauthorized': 'You are not authorized to use this path.',
        'auth/discarded': 'The token has already been logged out.',
        'request/username-taken': 'Username is already in use.',
        'request/invalid-password': 'Invalid password.'
    }

    if (error.validation && error.validation.length && error.validationContext === 'body') {
        statusCode = 400;
        errorCode = 'request/malformed';
    }

    if (errorMessage === errorCode) {
        errorMessage = errors[errorCode];
    }
    
    return response
        .code(statusCode)
        .send({
            success: false,
            code: errorCode,
            message: errorMessage
        })
}