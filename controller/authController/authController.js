const bcrypt = require("bcrypt");
const user = require("../../model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendEmail = require("../../services/sendMail");

exports.register = async (req, res) => {
  const { name, email, password, confirmpassword,phone } = req.body;
  const image = req.file
  if (!name || !email || !password || !confirmpassword || !phone) {
    return res.status(400).json({
      message: "please provide the needed data",
    });
  }
  const userExist = await user.find({ email: email });
  if (userExist.length != 0) {
    return res.status(409).json({
      message: "user already exist",
    });
  }
  if (password !== confirmpassword) {
    return res.status(400).json({
      message: "password and confirm password do not match",
    });
  } 

  await user.create({
    name: name,
    email: email,
    phone:phone,
    password: bcrypt.hashSync(password, 10),
    image: process.env.BACKEND_URL+image.filename,

  }); 
  res.status(201).json({
    message: "User registered successfully",
  });
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "please provide the needed data",
    });
  }

  const userFound = await user.find({ email: email });
  if (userFound == 0) {
    return res.status(404).json({
      message: "the user dosen't exist",
    });
  }
  const Password = bcrypt.compareSync(password, userFound[0].password);
  if (Password) {
    const token = jwt.sign(
      { id: userFound[0]._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({
      message: "User logged in successfully",
      token: token,
      user: userFound[0]
    });
  } else {
    res.status(404).json({
      message: "Invalid Password",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email ",
    });
  }

  const userExist = await user.find({ email });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  userExist[0].otp = otp;
  await userExist[0].save();
  await sendEmail({
    email: email,
    subject: "Otp for forgotPassword",
    message: `Your otp is ${otp} . You can use this to reset your password once`,
  });
  res.status(200).json({
    message: "OTP sent successfully",
  });
};


exports.otpcheck = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "please fill the required information",
    });
  }
  const userfound = await user.find({ email });
  if (userfound.length == 0) {
    return res.status(400).json({
      message: "the email is not valid",
    });
  }
  if (userfound[0].otp !== otp) {
    res.status(400).json({
      message: "otp is not valid",
    });
  } else {
    res.status(200).json({
      message: "otp is valid you may rechange your password",
    });
    userfound[0].otp = undefined;
    userfound[0].isotpverified = true;
    userfound[0].save();
  }
};

exports.resetpassword = async (req, res) => {
  const { email, newpassword, confirmpassword } = req.body;
  if (!email || !newpassword || !confirmpassword) {
    return res.status(403).json({
      message: "please provide the needed informations",
    });
  }

  const userfound = await user.find({ email });

  if (userfound[0].isotpverified !== true) {
    return res.status(400).json({
      message: "action cannot be performed",
    });
  }

  if (newpassword !== confirmpassword) {
    return res.status(403).json({
      message: "the confirm password doesnt match with the new password",
    });
  }
  userfound[0].password = bcrypt.hashSync(newpassword, 10);
  userfound[0].isotpverified = false;
  userfound[0].save();
  return res.status(200).json({
    message: "password changed succesfully",
  });
};
