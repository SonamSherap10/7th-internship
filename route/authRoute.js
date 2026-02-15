const catchError = require("../middleware/catchError");
const router = require("express").Router();
const isAuthenticated = require("../middleware/authorization");
const { multer, storage } = require("../services/multerConfig");
const {
  login,
  register,
  forgotPassword,
  otpcheck,
  resetpassword,
  updateProfilePhoto,
} = require("../controller/authController/authController");

const upload = multer({ storage });
router.post("/register", upload.single("image"), catchError(register));
router.route("/login").post(catchError(login));
router.route("/forgotPassword").post(catchError(forgotPassword));
router.route("/otp").post(catchError(otpcheck));
router.route("/resetPassword").post(catchError(resetpassword));
router.put("/profile-photo", isAuthenticated, upload.single("image"), catchError(updateProfilePhoto));

module.exports = router;
