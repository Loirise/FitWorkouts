const TrainingPlan = require('./models/trainingPlan');
const ExpressError = require('./utils/ExpressError');
const { trainingplanSchema } = require('./joiSchemas');

module.exports.validatePlan = (req, res, next) => {
  const { error } = trainingplanSchema.validate(req.body);
  if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(400, msg)
  } else {
      next();
  };
};


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Must be logged in!');
        return res.redirect('/login');
    };
    next();
};

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
    }
    next();
};


module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const plan = await TrainingPlan.findById(id);
  if (!plan.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that.');
      return res.redirect(`/trainingplans/${id}`);
  };
  next();
};
