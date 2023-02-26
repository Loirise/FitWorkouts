const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainingplanSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    exercises: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('TrainingPlan', TrainingplanSchema);