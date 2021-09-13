const fastify = require('fastify');
const { routes } = require('./routes');

/**
 * Function to initialize server
 * 
 * @param {{ logger: boolean, trustProxy: boolean }} opts 
 * @returns {*}
 */
exports.build = async (opts = { logger: false, trustProxy: false }) => {
    // initialize server using Fastify
    const app = fastify(opts);

    routes(app);

    return app;
}