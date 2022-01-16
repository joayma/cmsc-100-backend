# POST create one user

- should create a user using username, password, first name and last name
- username, password, first name, and last name should be strings and are required in the database with username to be unique and index.
- dateUpdated and dateCreated are of type number in UNIX Epoch type and created automatically in the model's schema
- isAdmin property is default false
- should encrypt the password before saving in the database
- should return a 403 (forbidden) if a similar username already exists
- should return a 400 (bad request) if password is less than 12 characters and has numbers and special characters
- should return only success true when an account has been created
