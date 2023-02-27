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
    9.99,
    19.99,
    34.99,
    69.69,
    42.00,
    99.99,
    120.00,
    149.49,
    72.49,
    199.19
]

durations = [
    2,
    3,
    4,
    5,
    6,
    8,
    10,
    12,
    16,
    20
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

numOfReps = [...Array(26).keys()].slice(5)

numOfExercises = [...Array(13).keys()].slice(3)

numOfSets = [...Array(11).keys()].slice(1)

numOfDays = [...Array(8).keys()].slice(3)

function randomNum (list) {
    return list[Math.floor((Math.random()*list.length))];
};

const seedDB = async () => {
    /* delete existing data */
    await TrainingPlan.deleteMany({});
    for(let i=0; i<31; i++){
        const plan = [] /* list of exercises (items below) */
        const amountExercises = randomNum(numOfExercises);
        for(let j=0; j < amountExercises; j++){
            const item = {
                'exercise': randomNum(exercisesList),
                'sets': randomNum(numOfSets),
                'reps': randomNum(numOfReps)
            }
            plan.push(item);
        };
        const trainingplan = new TrainingPlan({
            title: `${randomNum(word1)} ${randomNum(word2)} ${randomNum(word3)}`,
            price: randomNum(prices),
            duration: randomNum(durations),
            days: randomNum(numOfDays),
            level: randomNum(levels),
            exercises: plan 
        });
        /* save to db */
        /* console.log(trainingplan); */
        await trainingplan.save();
    };
};

seedDB();



