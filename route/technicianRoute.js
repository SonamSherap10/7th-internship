const router = require("express").Router();
const catchError = require("../middleware/catchError");
const isAuthenticated = require("../middleware/authorization");
const allowTo = require("../middleware/roleAuthorization");
const { multer, storage } = require("../services/multerConfig");

const { getAssignedRequests, resolveRequest, addNotes } = require("../controller/technicianController/technicianController");

const upload = multer({
  storage: storage,
});

router.route("/getRequest").get(isAuthenticated, catchError(getAssignedRequests));
router.post(
  "/resolveRequest/:id",
  isAuthenticated,
  allowTo("technician", "admin"),
  catchError(resolveRequest)
);
router.post(
  "/addNotes/:id",
  isAuthenticated,
  allowTo("technician", "admin"),
  upload.array("images", 5),
  catchError(addNotes)
);

module.exports = router;
