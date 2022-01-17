const { mongoose, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for logging a user POST: (/login)', () => {
    let app;
    const usernames = [];
    
    before(async () => {
      // initialize the backend applicaiton
      app = await build();

      for (let i = 0; i < 1; i++) {
      const response = await app.inject({
          method: 'POST',
          url: '/user',
          payload: {
            username: `user${i}`,
            password: 'thisisahiddenpassword'
          }
      });

      const payload = response.json();
      const { data } = payload;
      const { username } = data;

      usernames.push(username);
      }
  });

    after(async () => {
        // clean up the database
        for (const user of usernames) {
            await User.findOneAndDelete({ user });
        }
        await mongoose.connection.close();
    });
    
    // happy path: payload has username and password property
    it('it should return { success: true, data: (new user object) } and has a status code of 200 when called using POST', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/login',
          payload: {
            username: usernames[0],
            password: 'thisisahiddenpassword'
          }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
    });

    // non-happy path: wrong password
    it('it should return { success: false, message: error message } and has a status code of 401 when called using POST and password is wrong', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/login',
        payload: {
          	username: usernames[0],
            password: 'thisisahiddenpassword'
          }
      });
      
      const payload = response.json();
      const { statusCode } = response;
      const { success, message } = payload;

      success.should.equal(false);
      statusCode.should.equal(401);
      should.exist(message);
    })

    // non-happy path: no password property
    it('it should return { success: false, message: error message } and has a status code of 401 when called using POST and there is no password', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/login',
          payload: {
              username: 'sampleUser01',
              firstName: 'sampleFirst01',
              lastName: 'sampleLast01',
            }
        });
        
        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;
  
        // success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);
      })

});