const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const ComboPackageRoute = require("./routes/ComboPackage");
const CartRoute = require("./routes/Cart");
const GeneralRoute = require("./routes/GeneralMenu");
const OrderRoute = require("./routes/Order");
const CoinRoute = require("./routes/Coin");

const userRoute = require("./routes/user");

const { handleError } = require("./utils/handleResponse");

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_ROBO3T, () => {
  console.log("connected to Mongoose");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/v1/auth", authRoute);
app.use("/v1/combo-package", ComboPackageRoute);
app.use("/v1/cart", CartRoute);
app.use("/v1/general-menu", GeneralRoute);

//order
app.use("/v1/order", OrderRoute);

//coins
app.use("/v1/coin", CoinRoute);

// app.use("/v1/user", userRoute);
// app.use("/v1/province", locationRoute);
// app.use("/v1/posts", postsRoute);
// app.use("/v1/filter", filterRoute);

// app.use("/v1", productRoute)

// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(__dirname + "/public"));
// app.use("/uploads", express.static("uploads"));

app.use((err, req, res, next) => {
  return handleError(res, err);
});
app.listen(3000, () => {
  console.log("Server is running");
});


