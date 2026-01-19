const repairRequest = require("../../model/repairRequestModel");
const users = require("../../model/userModel");
const category = require("../../model/repairCategoryModel");
const Notification = require("../../model/notificationModel");

exports.addCategory = async (req, res) => {
    const { categoryName } = req.body;
    if (!categoryName) {
        return res.status(400).json({ message: "Category name is required" });
    } 
    await category.create({ name : categoryName });
    res.status(201).json({ message: "Category added successfully" });
}

exports.getAllCategories = async (req, res) => {
    const categories = await category.find();
    res.status(200).json(categories);
}

exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    const existingCategory = await category.findById(categoryId);
    if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
    }
    await category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
}

exports.getAllUsers = async (req, res) => {
    const allUsers = await users.find().select('-password');
    res.status(200).json(allUsers);
}

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    const existingUser = await users.findById(userId);  
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }
    await users.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
}

exports.editUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    if(!userId || !role){
        return res.status(400).json({ message: "User ID and role are required" });
    } 
    const existingUser = await users.findById(userId);  
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }
    existingUser.role = role;
    await existingUser.save();
    res.status(200).json({ message: "User role updated successfully" });
}

exports.getAllRepairRequests = async (req, res) => {
    const allRequests = await repairRequest.find()
    if (allRequests.length === 0) {
        return res.status(404).json({ message: "No repair requests found" });
    }
    res.status(200).json(allRequests);
}

exports.assignTechnician = async (req, res) => {
    const { requestId } = req.params;
    const { technicianId } = req.body;
    if (!technicianId) {
        return res.status(400).json({ message: "Technician ID is required" });
    }
    const existingRequest = await repairRequest.findById(requestId);
    if (!existingRequest) {
        return res.status(404).json({ message: "Repair request not found" });
    }
    const technician = await users.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
        return res.status(400).json({ message: "Invalid technician ID" });
    }
    existingRequest.technicianId = technicianId;
    await existingRequest.save();

    // notify technician about assignment
    await Notification.create({
        requestId,
        recipient: technicianId,
        type: "assigned",
        message: `You have been assigned to repair request ${existingRequest.serviceCode || ""}`.trim(),
    });

    // optionally notify customer
    if (existingRequest.requestedBy) {
        await Notification.create({
            requestId,
            recipient: existingRequest.requestedBy,
            type: "assigned",
            message: `A technician has been assigned to your repair request ${existingRequest.serviceCode || ""}`.trim(),
        });
    }

    res.status(200).json({ message: "Technician assigned successfully" });
}
