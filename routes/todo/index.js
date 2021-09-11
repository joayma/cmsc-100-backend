const { create } = require('./create');

/**
 * 
 *  initialize all routes for todo
 * 
 * @param {*} app 
 */
 exports.todo = (app) => {
    create(app);
}