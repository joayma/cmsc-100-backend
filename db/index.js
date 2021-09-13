const mongoose = require('mongoose');

// connect to the mongodb instance
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * 
 * Creates a connection to the dabatase
 * @returns {Promise}
 */
exports.connect = () => new Promise((resolve, reject) => {
    const connection = mongoose;
    connection.on('error', reject);
    connection.once('open', resolve);
})

exports.Todo = require('./models/todo')(mongoose);
exports.mongoose = mongoose;