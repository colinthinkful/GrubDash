// Middleware function to validate the request body
function bodyDataHas(from, propertyName) {
  return function(req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next(); // Call `next()` without an error message if the result exists
    }
    next({
      status: 400,
      message: `${from} must include a ${propertyName}`
    });
  };
}

module.exports = bodyDataHas;
