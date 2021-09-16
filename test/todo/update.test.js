const { delay } = require('../../lib/delay');
const { mongoose, Todo } = require('../../db');
const { build } = require('../../app');
const { todo } = require('tap');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for updating one todo PUT: (/todo/:id)', () => {
    let app;
    const ids = [];
  
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
        for (const id of ids) {
            await Todo.findOneAndDelete({ id });
        }
        await mongoose.connection.close();
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

        const todo = await Todo
            .findOne({ id })
            .exec();

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

        const todo = await Todo
            .findOne({ id })
            .exec();

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

        const todo = await Todo
            .findOne({ id })
            .exec();

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