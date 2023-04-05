const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 40 } })
    .sort("price")
    .select("name price");
  res.status(200).json({ nbhits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  // numeric filters //{ price: { $gt: 40 } }
  // price>40 to  { price: { $gt: 40 } }
  if (numericFilters) {
    const operaterMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const reqEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      reqEx,
      (match) => `-${operaterMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);
  let result = Product.find(queryObject);

  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  //fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result.select(fieldsList);
  }
  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ nbhits: products.length, products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
