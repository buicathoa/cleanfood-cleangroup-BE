const UserModel = require("./../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { to } = require("await-to-js");
// const { Province, District, Ward } = require("../models/location");
// const { genLocation } = require("../helper");

const authController = {
  registerUser: async (req, res) => {
    const {
      username,
      email,
      firstname,
      lastname,
      is_active,
      is_admin,
      password
    } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const checkUser = await UserModel.findOne({ email: req.body.email });
      const userCount = await UserModel.count()
      console.log(hashed)
      if (!checkUser) {
        // const combineLocation = await genLocation(address_detail, province_id, district_id,ward_id)
          const newUser = await new UserModel({
            username: username,
            password: hashed,
            email: email,
            firstname: firstname,
            lastname: lastname,
            user_count: userCount + 1,
            is_active: is_active,
            is_admin: is_admin,
            // full_address: combineLocation,
            // phone_number: phone_number
          });
          // console.log('combineLocation', combineLocation)
        console.log('vo k', newUser)
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //       user: 'joshtesbackpack@gmail.com',
        //       pass: 'kybhtbyqhseyogke'
        //     }
        //   });

        //   var mailOptions = {
        //     from: 'joshtesbackpack@gmail.com',
        //     to: req.body.email,
        //     subject: `Verify account email from  Joshtes`,
        //     html: `<h1>Xin chào ${req.body.username}, vui lòng click vào link dưới để xác thực tài khoản</h1>`
        //   };

        //   transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log('error Mail', error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });
        const user = await newUser.save()
        let userResponse = user;
      
        delete userResponse.password;
        res.status(200).json(userResponse);
      } else {
        return res.status(400).json("this mail was created by another one");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  loginUser: async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const user = await UserModel.findOne({ username: req.body.username });
    if (user) {
      const userResponse = {...user};
      delete userResponse.password
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).json("Invalid email or password");
      } else {
        if (user.is_active) {
          const accessToken = jwt.sign(
            {
              id: user.id,
              is_admin: user.is_admin,
              username: user.username,
            },
            process.env.MY_SECRET_ACCESS_KEY,
            {
              expiresIn: "24h",
            }
          );
          return res
            .status(200)
            .json({
              message: "Login successfully!",
              data: userResponse,
              token: accessToken,
            });
        } else {
          return res.status(400).json("This account have not active yet!");
        }
      }
    } else {
      return res.status(400).json("Invalid email or password");
    }
  },
  verifyUser: async (req, res) => {
    try {
      const updateActivate = await UserModel.findByIdAndUpdate(req.body.id, {
        activate: true,
      });
      console.log("updateActivate", updateActivate);
      await updateActivate.save();
      return res.status(200).json({ status: "Ok" });
      // return res.status(200).json(updateActivate)
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json("This email has not already exist !");
      } else {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "haojoehart4@gmail.com",
            pass: "lcfntjzziqjqhtxy",
          },
        });

        var mailOptions = {
          from: "haojoehart4@gmail.com",
          to: user.email,
          subject: `Verify account email from BakeryBD`,
          amp: `<!doctype html>
          <html ⚡4email>
            <body>
              <p>Click this <a href="facebook.com">link</a>to verify your account!</p>
            </body>
          </html>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log("error Mail", error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  recoveryPassword: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const user = await UserModel.findByIdAndUpdate(req.body.id, {
        password: hashed,
      });
      await user.save();
      return res.status(200).json("Update password success!");
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = authController;
