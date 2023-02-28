const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const TrainingPlan = require('./models/trainingPlan');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { trainingplanSchema } = require('./joiSchemas.js');

const app = express();
const db = mongoose.connection;

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

mongoose.connect('mongodb://127.0.0.1:27017/fitworkouts')

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view enginge', 'ejs');
app.set('views', path.join(__dirname, '/views'));
/* app.use('/public', express.static('public')); */

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validatePlan = (req, res, next) => {
    const { error } = trainingplanSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    };
};

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/trainingplans', wrapAsync(async (req, res) => {
    const trainingplans =  await TrainingPlan.find({});
    res.render('trainingplans/index.ejs', {trainingplans})
}));

app.get('/trainingplans/new', (req, res) => {
    res.render('trainingplans/new.ejs', {exercisesList});
});

app.post('/trainingplans', validatePlan, wrapAsync(async (req, res) => {
    /* save to db */
    const newPlan = new TrainingPlan(req.body.trainingplan);
    await newPlan.save();
    res.redirect(`/trainingplans/${newPlan._id}`)
}));

app.get('/trainingplans/:id', wrapAsync(async (req, res) => {
    const plan = await TrainingPlan.findById(req.params.id)
    res.render('trainingplans/show.ejs', {plan});
}));

app.get('/trainingplans/:id/edit', wrapAsync(async (req, res) => {
    const plan = await TrainingPlan.findById(req.params.id)
    res.render('trainingplans/edit.ejs', {plan, exercisesList});
}));

app.put('/trainingplans/:id', validatePlan, wrapAsync(async (req,res) => {
    /* get the id of the plan */
    const { id } = req.params;
    /* find in db by id and update */
    const editedPlan = await TrainingPlan.findByIdAndUpdate(id, { ...req.body.trainingplan });
    res.redirect(`/trainingplans/${editedPlan._id}`)
}));

app.delete('/trainingplans/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    await TrainingPlan.findByIdAndDelete(id);
    res.redirect('/trainingplans');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    const { statusCode=500 } = err;
    if(!err.message) err.message = 'Error. Something went wrong!';
    res.status(statusCode).render('error.ejs', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});


