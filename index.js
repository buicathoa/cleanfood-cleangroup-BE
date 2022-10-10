const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const weekdaysRoute = require("./routes/weekdays");
const ComboPackageRoute = require("./routes/ComboPackage");
const userRoute = require("./routes/user");
// const locationRoute = require("./routes/location");
// const postsRoute = require("./routes/posts");
// const productRoute = require("./routes/product")
// const filterRoute = require("./routes/filter")

const { handleError } = require("./utils/handleResponse");
const bodyParser = require("body-parser");
const redis = require("redis");
const fs = require("fs").promises
// const puppeteer = require("puppeteer");
// const { request } = require("express");
// const request = require("request-promise-native");
// const poll = require("promise-poller").default;
const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_ROBO3T, () => {
  console.log("connected to Mongoose");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/v1/auth", authRoute);
app.use("/v1/weekdays", weekdaysRoute);
app.use("/v1/combo-package", ComboPackageRoute);

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


