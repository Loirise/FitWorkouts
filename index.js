const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const TrainingPlan = require('./models/trainingPlan');

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

app.set('view enginge', 'ejs');
app.set('views', path.join(__dirname, '/views'));
/* app.use('/public', express.static('public')); */

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/trainingplans', async (req, res) => {
    const trainingplans =  await TrainingPlan.find({});
    res.render('trainingplans/index.ejs', {trainingplans})
});

app.get('/trainingplans/new', (req, res) => {
    res.render('trainingplans/new.ejs', {exercisesList});
})

app.post('/trainingplans', async (req, res) => {
    /* get all exercises arrays */
    let exercisesList = []
    for(let i=1; i < 13; i++){
        let list = []
        let exercise = {}
        if(req.body.hasOwnProperty(i)){
            list = req.body[i]
            exercise[list[0]] = list[1];
            exercisesList.push(exercise);
        };
    };
    /* convert exercicesList items into objects */
    let exercises = []
    for(let j=0; j < exercisesList.length; j++){
        let temp = {};
        temp[j+1] = exercisesList[j];
        exercises.push(temp);
    }
    const trainingplanPart = req.body.trainingplan;
    trainingplanPart['exercises'] = exercises;
    const trainingplan = new TrainingPlan(trainingplanPart);
    await trainingplan.save();
    res.redirect(`/trainingplans/${trainingplan._id}`);
})

app.get('/trainingplans/:id', async (req, res) => {
    const plan = await TrainingPlan.findById(req.params.id)
    res.render('trainingplans/show.ejs', {plan});
});

app.get('/trainingplans/:id/edit', async (req, res) => {
    const plan = await TrainingPlan.findById(req.params.id)
    console.log(plan.exercises)
    res.render('trainingplans/edit.ejs', {plan, exercisesList});
})


app.listen(3000, () => {
    console.log('Serving on port 3000');
});


