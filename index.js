const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./routes/AuthRoute");
const ProductRoute = require("./routes/ProductRoute");
const CartRoute = require("./routes/CartRoute");
const GeneralMenuRoute = require("./routes/GeneralMenuRoute");
const OrderRoute = require("./routes/OrderRoute");
const CoinRoute = require("./routes/CoinRoute");
const UserRoute = require("./routes/UserRoute");
const LocationRoute = require("./routes/LocationRoute");
const DeliveryRoute = require("./routes/DeliveryRoute");
// const userRoute = require("./routes/user");

const { handleError } = require("./utils/handleResponse");
const bodyParser = require('body-parser');

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_ROBO3T, () => {
  console.log("connected to Mongoose");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json()) 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/v1/auth", AuthRoute);
app.use("/v1/product", ProductRoute);
app.use("/v1/cart", CartRoute);
app.use("/v1/general-menu", GeneralMenuRoute);

//user
app.use("/v1/user", UserRoute)

//order
app.use("/v1/order", OrderRoute);

//coins
app.use("/v1/coin", CoinRoute);

//location
app.use("/v1/location", LocationRoute);

//delivery
app.use("/v1/delivery", DeliveryRoute);


// app.use("/v1/user", userRoute);
// app.use("/v1/province", locationRoute);
// app.use("/v1/posts", postsRoute);
// app.use("/v1/filter", filterRoute);

// app.use("/v1", productRoute)

// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(__dirname + "/public"));
// app.use("/uploads", express.static("uploads"));


app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.use((err, req, res, next) => {
  return handleError(res, err);
});;


app.listen(3000, () => {
  console.log("Server is running");
});


