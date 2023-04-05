const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const checkPermissions = require("../utils/checkPermissions");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new customError.BadRequestError("please add items to the card");
  }
  if (!tax || !shippingFee) {
    throw new customError.BadRequestError(
      "please provide tax and shipping fee"
    );
  }
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({
      _id: item.product,
    });
    if (!dbProduct) {
      throw new customError.BadRequestError(
        `couldn't find product with this id ${item.product}`
      );
    }
    const { name, price, image, _id: productId } = dbProduct;

    const SingleOrderItem = {
      product: productId,
      name,
      price,
      image,
      amount: item.amount,
    };
    // add SingleOrderItem to orderItems[]
    orderItems = [...orderItems, SingleOrderItem];
    // calculating subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  //get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ client_secret: paymentIntent.client_secret, order });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({
    _id: orderId,
  });
  if (!order) {
    throw new customError.NotFoundError(
      `couldn't find product with this id ${orderId}`
    );
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user.userId,
  });
  res.status(StatusCodes.OK).json({ nth: orders.length, orders });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({
    _id: orderId,
  });
  if (!order) {
    throw new customError.NotFoundError(
      `couldn't find product with this id ${orderId}`
    );
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
  res.send("update order");
};
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
