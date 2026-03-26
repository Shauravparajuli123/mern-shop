const Order = require('../models/Order');

const createOrder = async (req, res) => {
  const { items, shippingAddress, totalPrice } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'No items in order' });
  const order = await Order.create({ user: req.user._id, items, shippingAddress, totalPrice });
  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
};

const markDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  res.json(await order.save());
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, markDelivered };