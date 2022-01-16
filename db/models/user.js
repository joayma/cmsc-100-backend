/**
 * Exports the model for user
 * @param {import('mongoose').Mongoose} mongoose
 */
module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        immutable: true,
        index: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    // isAdmin: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
    password: {
        type: String,
        required: true
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

    return mongoose.model('User', userSchema);
};
