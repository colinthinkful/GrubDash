// Middleware function to validate the request body
function validateOrderStatus() {
  return function(req, res, next) {
    const { data: { status } = {} } = req.body;

    if(status) {
      if(status === "delivered") {
        return next({
          status: 400,
          message: `A delivered order cannot be changed`
        });
      } else {
        //happy path
        return next(); // Call `next()` without an error message if the result exists
      }
    }
    next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, delivered`
    });
  };
}

module.exports = validateOrderStatus;
