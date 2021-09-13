const { getTodos } = require('../../lib/get-todos');
const { delay } = require('../../lib/delay');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { build } = require('../../app');
const { todo } = require('tap');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for getting one todo GET: (/todo/:id)', () => {
    let app;
    const ids = [];
    const filename = join(__dirname, '../../database.json');
    const encoding = 'utf8';
  
    before(async () => {
        // initialize the backend applicaiton
        app = await build();

        for (let i = 0; i < 1; i++) {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            payload: {
            text: `Todo ${i}`,
            isDone: false
            }
        });

        const payload = response.json();
        const { data } = payload;
        const { id } = data;

        ids.push(id);
        await delay(1000);
        }
    });
  

    after(async () => {
        // clean up the database
        const todos = getTodos(filename, encoding);
        for (const id of ids) {
          // find the index
          const index = todos.findIndex(todo => todo.id === id);
    
          // delete the id
          if (index >= 0) {
            todos.splice(index, 1);
          }
    
          writeFileSync(filename, JSON.stringify({ todos }, null, 2), encoding);
        }
      });

    // happy path
    it('it should return { success: true, data: todo } and has a status code of 200 when called using GET', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/${ids[0]}`
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { text, isDone, id } = data;

        success.should.equal(true);
        statusCode.should.equal(200);

        const todos = getTodos(filename, encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const todo = todos[index];

        text.should.equal(todo.text);
        isDone.should.equal(todo.isDone);
        id.should.equal(todo.id);
    });

    // non-happy path
    it('it should return { success: true, message: error message } and has a status code of 404 when called using GET and the id of todo does not exists', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/123456`
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(404);

        should.exists(code);
        should.exists(message);
    });

});