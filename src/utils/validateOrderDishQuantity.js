// Middleware function to validate the request body
function validateOrderDishQuantity() {
  return function(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    let dishesAreValid = true;
    let dishIndex = 0;

    for(let i=0; i<dishes.length; i++) {
      if(dishes[i].quantity) {
        if(typeof dishes[i].quantity !== "number") {
          dishIndex = i;
          dishesAreValid = false;
          break;
        } else if(dish.quantity < 1) {
          dishIndex = i;
          dishesAreValid = false;
          break;
        }
      } else {
        dishIndex = i;
        dishesAreValid = false;
        break;
      }
    }

    if(dishesAreValid) {
      return next(); // Call `next()` without an error message if the result exists
    }
    next({
      status: 400,
      message: `Dish ${dishIndex} must have a quantity that is an integer greater than 0`
    });
  };
}

module.exports = validateOrderDishQuantity;
