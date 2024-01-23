const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Middleware functions
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find(dish => dish.id === dishId);

  if(foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}

function idMatchesDishId(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;
  const idMatchesDishId = id ? id === dishId : true;
  if(idMatchesDishId) {
    return next();
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

function bodyDataHasName(req, res, next) {
  const { data: { name } = {} } = req.body;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must include a name`
  });
}

function bodyDataHasDescription(req, res, next) {
  const { data: { description } = {} } = req.body;
  if (description) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must include a description`
  });
}

function bodyDataHasPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (price) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must include a price`
  });
}

function bodyDataHasImgUrl(req, res, next) {
  const { data: { image_url } = {} } = req.body;
  if (image_url) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must include a image_url`
  });
}

function dishPriceIsInt(req, res, next) {
  const { data: { price } = {} } = req.body;
  if(Number.isInteger(price)) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must have a price that is an integer greater than 0`
  });
}

function dishPriceIsPositive(req, res, next) {
  const { data: { price } = {} } = req.body;
  if(price > 0) {
    return next();
  }
  next({
    status: 400,
    message: `Dish must have a price that is an integer greater than 0`
  });
}

// API functions
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
    bodyDataHasName,
    bodyDataHasDescription,
    bodyDataHasPrice,
    dishPriceIsInt,
    dishPriceIsPositive,
    bodyDataHasImgUrl,
    create
  ],
  read: [
    dishExists,
    idMatchesDishId,
    read
  ],
  update: [
    dishExists,
    idMatchesDishId,
    bodyDataHasName,
    bodyDataHasDescription,
    bodyDataHasPrice,
    dishPriceIsInt,
    dishPriceIsPositive,
    bodyDataHasImgUrl,
    update
  ],
  list
};
