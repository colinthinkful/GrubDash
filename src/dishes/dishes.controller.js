const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
// Use these functions to check for required request data
const bodyDataHas = require("../utils/bodyDataHas");
const dataIsInt = require("../utils/dataIsInt");
const intIsPositive = require("../utils/intIsPositive");

// Middleware function to validate existence of a dish
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;
  const foundDish = dishes.find(dish => dish.id === dishId);
  const idMatchesDishId = id ? id === dishId : true;

  if(foundDish) {
    if(idMatchesDishId) {
      res.locals.dish = foundDish;
      return next();
    } else {
      next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
      });
    }
  } else {
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}.`,
    });
  }
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function update(req, res) {
  const dish = res.locals.dish;
  const { data: { name, description, price, image_url } = {} } = req.body;

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create: [
    bodyDataHas("Dish", "name"),
    bodyDataHas("Dish", "description"),
    bodyDataHas("Dish", "price"),
    dataIsInt("Dish", "price"),
    intIsPositive("Dish", "price"),
    bodyDataHas("Dish", "image_url"),
    create
  ],
  read: [
    dishExists,
    read
  ],
  update: [
    bodyDataHas("Dish", "name"),
    bodyDataHas("Dish", "description"),
    bodyDataHas("Dish", "price"),
    dataIsInt("Dish", "price"),
    intIsPositive("Dish", "price"),
    bodyDataHas("Dish", "image_url"),
    dishExists,
    update
  ],
  list
};
