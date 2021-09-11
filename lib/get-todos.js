const { readFileSync } = require('fs');

/**
 * Reads the file and gets the todos
 * @param {string} filename 
 * @param {string} encoding 
 * @returns {[{text: string, done: boolean, id: string}]}
 */
exports.getTodos = (filename, encoding) => {
    const databaseString = readFileSync(filename, encoding);
    const database = JSON.parse(databaseString);
    const { todos } = database;
    return todos;
}