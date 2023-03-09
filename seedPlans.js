require('dotenv').config();
const mongoose = require('mongoose');
const TrainingPlan = require('./models/trainingPlan');
const User = require('./models/user');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/fitworkouts'
await mongoose.connect(dbUrl)

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

numOfRepsList = [...Array(26).keys()].slice(5)

numOfExercisesList = [...Array(13).keys()].slice(3)

numOfSetsList = [...Array(11).keys()].slice(1)

numOfDaysList = [...Array(8).keys()].slice(3)

function randomNum (list) {
    return list[Math.floor((Math.random()*list.length))];
};

const seedDB = async () => {
    /* delete existing data */
    await TrainingPlan.deleteMany({})
    /* find admin and asign all the plans to be created to him */
    const admin = await User.findByUsername('admin');
    /* last 5 plans will be asigned to testuser */
    const testuser = await User.findByUsername('testuser');
    /* creating 31 random plans */
    for(let i=0; i<31; i++){
        /* getting random number of exercises becuase there must be equal amount of exercises, sets and reps */
        const x = randomNum(numOfExercisesList);
        /* creating plan object */
        const trainingplan = new TrainingPlan({
            author: i < 26 ? admin._id : testuser._id,
            title: `${randomNum(word1)} ${randomNum(word2)} ${randomNum(word3)}`,
            duration: randomNum(durations),
            days: randomNum(numOfDaysList),
            level: randomNum(levels),
            exercises: Array.apply(null, {length: x}).map(i => randomNum(exercisesList)),
            sets: Array.apply(null, {length: x}).map(i => randomNum(numOfSetsList)),
            reps: Array.apply(null, {length: x}).map(i => randomNum(numOfRepsList)),
        });
        /* save to db */
        /* console.log(trainingplan); */
        await trainingplan.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
});



