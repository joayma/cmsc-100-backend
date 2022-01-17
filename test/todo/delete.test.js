const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for deleting one todo DELETE: (/todo/:id)', () => {
    let app;
    let authorization;
    const ids = [];
  
    before(async () => {
        // initialize the backend applicaiton
        app = await build();

        const payload = {
            username: 'User01',
            firstName: 'First01',
            lastName: 'Last01',
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
        await User.findOneAndDelete({ username: 'User01' });
        await mongoose.connection.close();
    });

    // happy path
    it('it should return { success: true } and has a status code of 200 when called using DELETE', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/todo/${ids[0]}`,
            header: {
                authorization
              },
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;
        const id = ids[0];

        success.should.equal(true);
        statusCode.should.equal(200);

        const todo = await Todo
            .findOne({ id })
            .exec();

        should.not.exists(todo);
    });

    // non-happy path
    it('it should return { success: true, message: error message } and has a status code of 404 when called using DELETE and the id of todo does not exists', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/todo/123456',
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