// Middleware function to validate the request body
function validateOrderNotPending() {
  return function(req, res, next) {
    const { data: { status } = {} } = req.body;

    if(status) {
      if(status === "pending") {
        return next(); // Call `next()` without an error message if the result exists
      } else {
        return next({
          status: 400,
          message: `An order cannot be deleted unless it is pending.`
        });
      }
    }
  };
}

module.exports = validateOrderNotPending;
