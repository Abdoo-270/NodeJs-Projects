require("dotenv").config();
//async errors
require("express-async-errors");
const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

//Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//parsing data coming from the server
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send(`<h1>04 store api</h1> <a href="/api/v1/products">products</a>`);
});

//product routes
app.use("/api/v1/products", productsRouter);

//Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// port name
const port = process.env.PORT || 3000;

// starting the server
const start = async () => {
  try {
    //connectDb
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listining to ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
