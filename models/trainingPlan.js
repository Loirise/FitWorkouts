const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainingplanSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    days: {
        type: Number,
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
    },
    sets: {
        type: Array,
        required: true
    },
    reps: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('TrainingPlan', TrainingplanSchema);