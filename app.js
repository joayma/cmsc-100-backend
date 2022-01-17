const fastify = require('fastify');
const swagger = require('fastify-swagger');
const sensible = require('fastify-sensible');
const jwt = require('fastify-jwt');
const auth = require('fastify-auth');
const { readFileSync } = require('fs');
const { errorHandler } = require('./error-handler');
const { definitions } = require('./definitions');
const { routes } = require('./routes');
const { connect, User } = require('./db');
const { name: title, description, version } = require('./package.json');

const audience = 'this-audience';
const issuer = 'localhost';
/**
 * Function to initialize server
 * 
 * @param {{ logger: boolean, trustProxy: boolean }} opts 
 * @returns {*}
 */
exports.build = async (opts = { logger: false, trustProxy: false }) => {
    // initialize server using Fastify
    const app = fastify(opts);

    app.register(sensible).after(() => {
        app.setErrorHandler(errorHandler)
    })

    app.register(jwt, {
        secret: {
            private: readFileSync('./cert/keyfile', 'utf8'),
            public: readFileSync('./cert/keyfile.key.pub', 'utf8'),
        },
        sign: {
            algorithm: 'RS256',
            audience,
            issuer,
            expiresIn: '1h',
        },
        verify: {
            audience,
            issuer
        }
    })

    await app
        .decorate('verifyJWT', async (request, response) => {
            const { headers } = request;
            const { authorization } = headers;

            let authorizationToken;

            if (!authorization) {
                return response.unauthorized('auth/no-authorization-header');
            }

            if (authorization) {
                // expected to have authorization to be "Bearer [token]"
                [, authorizationToken] = authorization.split('Bearer ');
            }

            const token = authorizationToken;

            try {
                await app.jwt.verify(token);
                const { username } = app.jwt.decode(token);

                const user = await User.findOne({ username }).exec();

                if(!user) {
                    return response.unauthorized('auth/no-user');
                }

                request.user = user;
                request.token = token;
            } catch (error) {
                console.log(error);

                if (error.message === 'jwt expired') {
                    return response.unauthorized('auth/expired');
                }
                return response.unauthorized('auth/unauthorized');
            }
        })
        .register(auth);

    app.register(swagger, {
        routePrefix: '/docs',
        exposeRoute: true,
        swagger: {
            info: {
                title,
                description,
                version
            },
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            definitions,
            securityDefinitions: {
                bearer: {
                    type: 'apiKey',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'authorization',
                    in: 'header'

                }
            }
        }
      })    

    await connect();

    routes(app);

    return app;
}