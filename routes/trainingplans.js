const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');
const TrainingPlan = require('../models/trainingPlan');
const { trainingplanSchema } = require('../joiSchemas');
const { isLoggedIn } = require('../middleware');

const validatePlan = (req, res, next) => {
    const { error } = trainingplanSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    };
};

exercisesList = [
    'bar dip',
    'bench press',
    'dumbbell chest press',
    'push up',
    'barbell front raise',
    'cable lateral raise',
    'dumbbell rear delt row',
    'face pull',
    'barbell curl',
    'dumbbell curl',
    'cable curl',
    'hammer curl',
    'bench dip',
    'close-grip push up',
    'barell lying triceps extension',
    'overhead cable triceps extension',
    'barbell lunge',
    'front squat',
    'goblet squat',
    'pause squat',
    'bulgarian split squat',
    'barbell squat',
    'side squat',
    'back extension',
    'barbell row',
    'chin-up',
    'pull-up',
    'deadlift',
    'kettlebell swing',
    'barbell shrug',
    'lat pulldown',
    'romanian deadlift',
    'hip thrust',
    'cable crunch',
    'hanging leg raise',
    'oblique crunch',
    'plank',
    'side plank',
    'sit-up',
    'mountain climbers',
    'heel raise',
    'standing calf raise',
    'seater calf raise',
    'wrist curl',
    'farmer walk',
    'wrist extension'
]


router.get('/', wrapAsync(async (req, res) => {
    const trainingplans =  await TrainingPlan.find({});
    res.render('trainingplans/index.ejs', {trainingplans})
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('trainingplans/new.ejs', {exercisesList});
});

router.post('/', isLoggedIn, validatePlan, wrapAsync(async (req, res) => {
    const newPlan = new TrainingPlan(req.body.trainingplan);
    await newPlan.save();
    req.flash('success', 'Successfully made new plan!');
    res.redirect(`/trainingplans/${newPlan._id}`);
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const plan = await TrainingPlan.findById(req.params.id);
    if(!plan){
        req.flash('error', 'Cannot find that workout plan');
        return res.redirect('/trainingplans');
    }
    res.render('trainingplans/show.ejs', {plan});
}));

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const plan = await TrainingPlan.findById(req.params.id);
    if(!plan){
        req.flash('error', 'Cannot find that workout plan');
        return res.redirect('/trainingplans');
    }
    res.render('trainingplans/edit.ejs', {plan, exercisesList});
}));

router.put('/:id', isLoggedIn, validatePlan, wrapAsync(async (req,res) => {
    const { id } = req.params;
    const editedPlan = await TrainingPlan.findByIdAndUpdate(id, { ...req.body.trainingplan });
    req.flash('success', 'Successfully edited the plan.');
    res.redirect(`/trainingplans/${editedPlan._id}`);
}));

router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    await TrainingPlan.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the plan.');
    res.redirect('/trainingplans');
}));

module.exports = router;