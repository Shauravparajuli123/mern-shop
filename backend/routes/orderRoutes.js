const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, markDelivered } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/myorders',    protect, getMyOrders);
router.get('/:id',         protect, getOrderById);
router.put('/:id/deliver', protect, admin, markDelivered);

module.exports = router;