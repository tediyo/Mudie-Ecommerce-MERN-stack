const Stripe = require( "stripe");
//import asyncHandler from 'express-async-handler';
//import Order from '../models/orderModel.js';
//import Stripe from 'stripe';
const dotenv = require ("dotenv");
//dotenv.config();
const asyncHandler = require("express-async-handler");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
//import Stripe from 'stripe';
// @desc    Create new order
// @route   POST /api/order
// @access  Private
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemPrices,
    taxPrice,
    shippingPrice,
    totalPrice,
   
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    for (let i = 0; i < orderItems.length; i++) {
      let tempProduct = await Product.findById(orderItems[i].product);
      if (tempProduct.countInStock - orderItems[i].qty < 0) {
        res.status(400);
        throw new Error(`${tempProduct.name} is not in stock`);
      }
    }
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemPrices,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    GET order by ID
// @route   GET /api/order/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/order/:id
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
     const { paymentMode } = req.body;
		order.isPaid = true;
		order.paidAt = Date.now();
		// update the payment result based on which mode of payment was chosen
		if (paymentMode === 'paypal') {
			order.paymentResult = {
				type: 'palpal',
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.payer.email_address,
			};
		} else if (paymentMode === 'stripe') {
			order.paymentResult = {
				type: 'stripe',
				id: req.body.id,
				status: req.body.status,
        update_time: req.body.update_time,

				email_address: req.body.payer.email_address,
			};
		} 


    //ffffffffffffff
    /*order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    } 
			};*/

    const updatedOrder = await order.save();
    const { orderItems } = order;
    for (let i = 0; i < orderItems.length; i++) {
      let tempProduct = await Product.findById(orderItems[i].product);
      tempProduct.countInStock -= orderItems[i].qty;
      const updatedPro = await tempProduct.save();
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get orders of user
// @route   GET /api/order/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/order
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDeliver = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC
 const stripePayment = asyncHandler(async (req, res) => {
	const { price, email } = req.body;

	// Need to create a payment intent according to stripe docs
	// https://stripe.com/docs/api/payment_intents
	const paymentIntent = await stripe.paymentIntents.create({
		amount: price,
		currency: 'inr',
		receipt_email: email,
		payment_method_types: ['card'],
	});

	// send this payment intent to the client side
	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});
module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDeliver,
  stripePayment,
};
