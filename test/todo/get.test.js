const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const { todo } = require('tap');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for getting one todo GET: (/todo/:id)', () => {
    let app;
    let authorization = '';
    const ids = [];
  
    before(async () => {
        // initialize the backend applicaiton
        app = await build();

        const payload = {
            username: 'User03',
            firstName: 'First03',
            lastName: 'Last03',
            password: 'thisisahiddenpassword'
        }

        await app.inject({
            method: 'POST',
            url: '/user',
            payload
        });

        const response = await app.inject({
          method: 'POST',
          url: '/login',
          payload
        });

        const { data: token } = response.json();
        
        authorization = `Bearer ${token}`;

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
        console.log(payload);
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
        await User.findOneAndDelete({ username: 'User03' });
        await mongoose.connection.close();
      });

    // happy path
    it('it should return { success: true, data: todo } and has a status code of 200 when called using GET', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/${ids[0]}`,
            header: {
                authorization
            },
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

    // non-happy path
    it('it should return { success: true, message: error message } and has a status code of 404 when called using GET and the id of todo does not exists', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/123456`,
            header: {
                authorization
            },
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