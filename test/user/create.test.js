const { mongoose, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for creating user POST: (/user)', () => {
    let app;
    const usernames = [];
    
    before(async () => {
        // initialize backend application
        app = await build();
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
          url: '/user',
          payload: {
            username: 'User01',
            firstName: 'sampleFirst',
            lastName: 'sampleLast',
            password: 'thisisahiddenpassword'
          }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { username, firstName, lastName } = data;    

        success.should.equal(true);
        statusCode.should.equal(200);
        username.should.equal('sampleUser');
        firstName.should.equal('sampleFirst');
        lastName.should.equal('sampleLast');

        const { 
            username: usernameDatabase } = await User
            .findOne({ username })
            .exec();

        username.should.equal(usernameDatabase);
    
        // add username in the usernames array for cleaning
        usernames.push(username);
    });

    // non-happy path: no username property
    it('it should return { success: false, message: error message } and has a status code of 400 when called using POST and there is no username', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user',
        payload: {
            firstName: 'sampleFirst',
            lastName: 'sampleLast',
            password: 'thisisahiddenpassword'
          }
      });
      
      const payload = response.json();
      const { statusCode } = response;
      const { success, message } = payload;

      // success.should.equal(false);
      statusCode.should.equal(400);
      should.exist(message);
    })

    // non-happy path: no password property
    it('it should return { success: false, message: error message } and has a status code of 400 when called using POST and there is no password', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/user',
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

    // non-happy path: no payload
    it('it should return { success: false, message: error message } and has a status code of 400 when called using POST and there is no payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/user',
      });
      
      const payload = response.json();
      const { statusCode } = response;
      const { success, message } = payload;

      // success.should.equal(false);
      statusCode.should.equal(400);
      should.exist(message);
    })
});