const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
const bodyDataHas = require("../utils/bodyDataHas");
const validateOrderDishes = require("../utils/validateOrderDishes");
const validateOrderDishQuantity = require("../utils/validateOrderDishQuantity");
const validateOrderStatus = require("../utils/validateOrderStatus");
const validateOrderNotPending = require("../utils/validateOrderNotPending");

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;
  const foundOrder = orders.find(order => order.id === Number(orderId));
  const idMatchesOrderId = id ? id === orderId : true;

  if(foundOrder) {
    if(idMatchesOrderId) {
      res.locals.order = foundOrder;
      return next();
    } else {
      next({
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
      });
    }
  } else {
    next({
      status: 404,
      message: `Order id not found: ${orderId}`,
    });
  }
}

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
}

function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === Number(orderId));
  const deletedOrders = orders.splice(index, 1);
  res.sendStatus(204);
}

function list(req, res) {
  res.json({ data: orders });
}

module.exports = {
  create: [
    bodyDataHas("Order", "deliverTo"),
    bodyDataHas("Order", "mobileNumber"),
    bodyDataHas("Order", "dishes"),
    validateOrderDishes(),
    validateOrderDishQuantity(),
    create
  ],
  read: [
    orderExists,
    read
  ],
  update: [
    orderExists,
    validateOrderStatus(),
    update
  ],
  delete: [
    validateOrderNotPending(),
    destroy
  ],
  list
}
