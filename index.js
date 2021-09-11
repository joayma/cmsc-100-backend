const { build } = require('./app');

/**
 * starts the application
 */

async function start() {
    // calls to build an app
    const app = await build();
    const port = parseInt(process.env.PORT || '8080');
    const address = '0.0.0.0';
    const addr = await app.listen(port, address);
    console.log(`Listening on ${addr}`);
}

start();