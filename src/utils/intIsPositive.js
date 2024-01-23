// Middleware function to validate the request body
function intIsPositive(from, propertyName) {
  return function(req, res, next) {
    const { data = {} } = req.body;
    if(data[propertyName] > 0) {
      return next(); // Call `next()` without an error message if the result exists
    }
    next({
      status: 400,
      message: `${from} must have a ${propertyName} that is an integer greater than 0`
    });
  };
}

module.exports = intIsPositive;
