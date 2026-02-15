const router = require("express").Router();
const catchError = require("../middleware/catchError");
const isAuthenticated = require("../middleware/authorization");
const { getNotesForRequest } = require("../controller/notesController/notesController");

router.get("/request/:requestId", isAuthenticated, catchError(getNotesForRequest));

module.exports = router;
