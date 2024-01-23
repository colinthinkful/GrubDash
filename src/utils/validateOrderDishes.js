// Middleware function to validate the request body
function validateOrderDishes() {
  return function(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    // Ensure object is array
    if (Object.prototype.toString.call(dishes) === '[object Array]') {
      // Ensure at least one dish is included
      if(dishes.length > 0) {
        return next(); // Call `next()` without an error message if the result exists
      }
    }
    next({
      status: 400,
      message: `Order must include at least one dish`
    });
  };
}

module.exports = validateOrderDishes;
