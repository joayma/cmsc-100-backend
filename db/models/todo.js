const { v4: uuid } = require('uuid');

/**
 * Exports the model for todo
 * @param {import('mongoose').Mongoose} mongoose
 */
module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const todoSchema = new Schema({
    id: {
        type: String,
        immutable: true,
        index: true,
        unique: true,
        default: uuid
    },
    username: {
        type: String,
        required: true,
        index: true,
    },
    text: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true,
        default: false
    },
    dateCreated: {
        type: Number,
        required: true,
        default: () => new Date().getTime()
    },
    dateUpdated: {
        type: Number,
        required: true,
        default: () => new Date().getTime()
    }
    });

    return mongoose.model('Todo', todoSchema);
};
