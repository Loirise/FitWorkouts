const mongoose = require('mongoose');
const TrainingPlan = require('./models/trainingPlan');

mongoose.connect('mongodb://127.0.0.1:27017/fitworkouts')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

word1 = [
    'Best',
    'Finest',
    'Top',
    'Prime',
    'Supreme',
    'Elite',
    'Leading',
    'Significant',
    'Big',
    'Large'
]
word2 = [
    'Shoulders',
    'Back',
    'Biceps',
    'Triceps',
    'Arms',
    'Chest',
    'Abs',
    'Legs',
    'Quads',
    'Glutes',
    'Hamstrings'
]
word3 = [
    'Plan',
    'Programme',
    'Routine'
]

prices = [
    '9.99 $',
    '19.99 $',
    '34.99 $',
    '69.69 $',
    '42.00 $',
    '99.99 $',
    '120.00 $',
    '149.49 $',
    '72.49 $',
    '199.19 $'
]

durations = [
    '2 weeks',
    '3 weeks',
    '4 weeks',
    '5 weeks',
    '6 weeks',
    '8 weeks',
    '10 weeks',
    '12 weeks',
    '16 weeks',
    '20 weeks'
]

levels = [
    'beginner',
    'intermediate',
    'advanced'
]

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

reps = [...Array(26).keys()].slice(5)

numOfExercises = [...Array(13).keys()].slice(4)

function randomNum (list) {
    return list[Math.floor((Math.random()*list.length))];
};

const seedDB = async () => {
    /* delete existing data */
    await TrainingPlan.deleteMany({});
    /* create new one */
    for(let i=0; i<31; i++){
        const plan = []
        const rand = randomNum(numOfExercises);
        for(let j=0; j < rand; j++){
            let exerciseNum = {}
            let exercise = {}
            let a = randomNum(exercisesList)
            let b = randomNum(reps)
            exercise[a] = b;
            exerciseNum[j+1] = exercise
            plan.push(exerciseNum);
        };
        /* console.log(plan) */

        /* create training plans */
        const trainingplan = new TrainingPlan({
            title: `${randomNum(word1)} ${randomNum(word2)} ${randomNum(word3)}`,
            price: randomNum(prices),
            duration: randomNum(durations),
            level: randomNum(levels),
            exercises: plan
        });
        /* save to db */
        await trainingplan.save()
    };
};

seedDB();



