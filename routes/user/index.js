const { create } = require('./create');
const { login } = require('./login');
/**
 * 
 *  initialize all routes for user
 * 
 * @param {*} app 
 */
 exports.user = (app) => {
    create(app);
    login(app);
}