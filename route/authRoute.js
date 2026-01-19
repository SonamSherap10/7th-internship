const catchError = require("../middleware/catchError");
const router = require("express").Router();
const { multer, storage } = require("../services/multerConfig");
const {
  login,
  register,
  forgotPassword,
  otpcheck,
  resetpassword
} = require("../controller/authController/authController");

const upload = multer({
   storage: storage 
  })
router.post('/register',upload.single("image"),catchError(register));
router.route("/login").post(catchError(login));
router.route("/forgotPassword").post(catchError(forgotPassword));
router.route("/otp").post(catchError(otpcheck));
router.route("/resetPassword").post(catchError(resetpassword));

module.exports = router;
