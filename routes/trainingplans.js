const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');

const { validatePlan, isLoggedIn, isAuthor } = require('../middleware');
const plans = require('../controllers/trainingplans');

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

router.route('/')
    .get(wrapAsync(plans.showAllPlans))
    .post(isLoggedIn, validatePlan, wrapAsync(plans.createNewPlan))

router.get('/new', isLoggedIn, plans.newPlanPage);

router.get('/myplans', isLoggedIn, plans.showOwnPlansPage);

router.route('/:id')
    .get(wrapAsync(plans.showPlanPage))
    .put(isLoggedIn, isAuthor, validatePlan, wrapAsync(plans.editPlan))
    .delete(isLoggedIn, isAuthor, wrapAsync(plans.deletePlan))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(plans.showEditPage));



module.exports = router;