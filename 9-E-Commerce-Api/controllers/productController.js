const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const customError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate("reviews");
  res.status(StatusCodes.OK).json({ nth: products.length, products });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new customError.NotFoundError(
      `sorry, we couldn't find product with id ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product) {
    throw new customError.NotFoundError(
      `sorry, we couldn't find product with id ${productId}`
    );
  }
  res.status(StatusCodes.CREATED).json({ product });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError("please upload file");
  }
  const uploadedImage = req.files.image;
  if (!uploadedImage.mimetype.startsWith("image")) {
    throw new customError.BadRequestError("please upload image");
  }
  const maxSize = 1024 * 1024;
  if (uploadedImage.size > maxSize) {
    throw new customError.BadRequestError(
      "image size should be less than 1 MB"
    );
  }
  const uploadedImagePath = path.join(
    __dirname,
    "../public/uploads/" + `${uploadedImage.name}`
  );
  console.log(uploadedImagePath);
  await uploadedImage.mv(uploadedImagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${uploadedImage.name}` });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new customError.NotFoundError(
      `sorry, we couldn't find product with id ${productId}`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "success, product removed" });
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
