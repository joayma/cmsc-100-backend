const { create } = require('./create');
const { getMany } = require('./get-many');
const { get } = require('./get'); 

/**
 * 
 *  initialize all routes for todo
 * 
 * @param {*} app 
 */
 exports.todo = (app) => {
    create(app);
    getMany(app);
    get(app);
}