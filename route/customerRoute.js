const router = require("express").Router();
const catchError = require("../middleware/catchError");
const isAuthenticated = require("../middleware/authorization");
const allowTo = require("../middleware/roleAuthorization");

const { addCustomerRequests,getCustomerRequests,getRequestsByCode, cancelRequest } = require("../controller/customerController/customerController");

router.route("/addRequest").post(catchError(addCustomerRequests));
router.post("/addRequest/:id", isAuthenticated, allowTo("user", "receptionist"),
 catchError(addCustomerRequests)
);
router.get("/viewRequests/:id", isAuthenticated, allowTo("user"),catchError(getCustomerRequests));
router.get("/viewRequest",catchError(getRequestsByCode))
router.get("/cancelRequest/:id", isAuthenticated, allowTo("user"),cancelRequest);

module.exports = router;
