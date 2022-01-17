const { create } = require('./create');
const { login } = require('./login');
const { auth } = require('./auth');
/**
 * 
 *  initialize all routes for user
 * 
 * @param {*} app 
 */
 exports.user = (app) => {
    create(app);
    login(app);
    auth(app);
}