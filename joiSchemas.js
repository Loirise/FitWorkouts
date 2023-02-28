const Joi = require('joi');

module.exports.trainingplanSchema = Joi.object({
    trainingplan: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0).max(999),
        duration: Joi.number().required().integer().min(1).max(20),
        days: Joi.number().required().integer().min(1).max(7),
        level: Joi.string().required().valid('beginner', 'intermediate', 'advanced'),
        exercises: Joi.array().required().items(Joi.string().allow('').required()).min(1).max(12),
        sets: Joi.array().required().items(Joi.number().allow('').required().integer().min(1).max(20)).min(1).max(12),
        reps: Joi.array().required().items(Joi.number().allow('').required().integer().min(1).max(100)).min(1).max(12)
    }).required()
});

