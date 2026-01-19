const router = require("express").Router();
const catchError = require("../middleware/catchError");
const isAuthenticated = require("../middleware/authorization");
const allowTo = require("../middleware/roleAuthorization");

const { addCategory, getAllCategories, deleteCategory, getAllUsers,
deleteUser, editUserRole, getAllRepairRequests , assignTechnician } = require("../controller/adminController/adminController");

router.route("/addCategory").post(isAuthenticated, allowTo("admin"), catchError(addCategory));
router.route("/categories").get(isAuthenticated, allowTo("admin"), catchError(getAllCategories));
router.route("/deleteCategory/:categoryId").delete(isAuthenticated, allowTo("admin"), catchError(deleteCategory));  
router.route("/users").get(isAuthenticated, allowTo("admin"), catchError(getAllUsers));
router.route("/deleteUser/:userId").delete(isAuthenticated, allowTo("admin"), catchError(deleteUser));
router.route("/editUserRole/:userId").put(isAuthenticated, allowTo("admin"), catchError(editUserRole));
router.route("/repairRequests").get(isAuthenticated, allowTo("admin"), catchError(getAllRepairRequests));
router.route("/assignTechnician/:requestId").put(isAuthenticated, allowTo("admin"  ), catchError(assignTechnician));

module.exports = router;
