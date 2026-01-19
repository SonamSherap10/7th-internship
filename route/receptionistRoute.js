const router = require("express").Router();
const catchError = require("../middleware/catchError");
const isAuthenticated = require("../middleware/authorization");
const allowTo = require("../middleware/roleAuthorization");

const {
  createRequestForCustomer,
  getCompletedRequestsAwaitingPayment,
  updatePaymentStatus,
} = require("../controller/ReceptionistController/receptionistController");

// Receptionist creates request on behalf of a specific customer
router.post(
  "/request/:customerId",
  isAuthenticated,
  allowTo("receptionist"),
  catchError(createRequestForCustomer)
);

// View completed repair requests that are not fully paid
router.get(
  "/requests/completed-awaiting-payment",
  isAuthenticated,
  allowTo("receptionist"),
  catchError(getCompletedRequestsAwaitingPayment)
);

// Update payment status for a request (pending/paid), record amount & date
router.post(
  "/payment/:requestId",
  isAuthenticated,
  allowTo("receptionist"),
  catchError(updatePaymentStatus)
);

module.exports = router;


