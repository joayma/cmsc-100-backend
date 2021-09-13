const { getTodos } = require('../../lib/get-todos');
const { delay } = require('../../lib/delay');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { build } = require('../../app');
const { todo } = require('tap');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for updating one todo PUT: (/todo/:id)', () => {
    let app;
    const ids = [];
    const filename = join(__dirname, '../../database.json');
    const encoding = 'utf8';
  
    before(async () => {
        // initialize the backend applicaiton
        app = await build();

        for (let i = 0; i < 4; i++) {
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
    it('it should return { success: true, data: todo } and has a status code of 200 when called using PUT and updates the todo', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[0]}`,
            payload: {
                text: 'New todo text',
                isDone: true
            }
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

        text.should.equal('New todo text');
        isDone.should.equal(true);

        text.should.equal(todo.text);
        isDone.should.equal(todo.isDone);
        id.should.equal(todo.id);
    });

    // happy path
    it('it should return { success: true, data: todo } and has a status code of 200 when called using PUT and updates the text only', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[1]}`,
            payload: {
                text: 'New todo text 1'
            }
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

        text.should.equal('New todo text 1');
        isDone.should.equal(false);

        text.should.equal(todo.text);
        isDone.should.equal(todo.isDone);
        id.should.equal(todo.id);
    });

    // happy path
    it('it should return { success: true, data: todo } and has a status code of 200 when called using PUT and updates the isDone only', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[2]}`,
            payload: {
                isDone: true,
            }
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

        isDone.should.equal(true);

        text.should.equal(todo.text);
        isDone.should.equal(todo.isDone);
        id.should.equal(todo.id);
    });

    // non-happy path
    it('it should return { success: true, message: error message } and has a status code of 404 when called using PUT and the id of todo does not exists', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/123456`,
            payload: {
                text: 'New todo text',
                isDone: true
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(404);

        should.exists(code);
        should.exists(message);
    });

    // non-happy path
    it('it should return { success: true, message: error message } and has a status code of 400 when called using PUT and there is no payload', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[3]}`
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(400);

        should.exists(code);
        should.exists(message);
    });

    // non-happy path
    it('it should return { success: true, message: error message } and has a status code of 400 when called using PUT and the payload has no text or done property', async () => {
        const response = await app.inject({
            method: 'PUT',
            url: `/todo/${ids[3]}`,
            payload: {}
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(400);

        should.exists(code);
        should.exists(message);
    });

});