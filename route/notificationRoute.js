const router = require("express").Router();
const catchError = require("../middleware/catchError");
const isAuthenticated = require("../middleware/authorization");

const {
  getMyNotifications,
  markNotificationRead,
} = require("../controller/notificationController/notificationController");

router.get("/", isAuthenticated, catchError(getMyNotifications));
router.patch("/:id/read", isAuthenticated, catchError(markNotificationRead));

module.exports = router;
