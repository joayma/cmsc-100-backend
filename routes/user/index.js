const { create } = require('./create');
const { login } = require('./login');
const { auth } = require('./auth');
const { logout } = require('./logout');
const { get } = require('./get');
const { getMany } = require('./get-many');
const { update } = require('./update');
const { deleteOne } = require('./delete');

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
    logout(app);
    get(app);
    getMany(app);
    update(app);
    deleteOne(app);
}