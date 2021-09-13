const { create } = require('./create');
const { getMany } = require('./get-many');

/**
 * 
 *  initialize all routes for todo
 * 
 * @param {*} app 
 */
 exports.todo = (app) => {
    create(app);
    getMany(app);
}