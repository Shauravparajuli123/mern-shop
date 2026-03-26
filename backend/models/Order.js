const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    price:    Number,
    quantity: Number,
    image:    String,
  }],
  shippingAddress: {
    address: String,
    city:    String,
    zip:     String,
  },
  totalPrice:  { type: Number, required: true },
  isPaid:      { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  paidAt:      Date,
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);