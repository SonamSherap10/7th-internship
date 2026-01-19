const { request } = require("express");
const repairRequest = require("../../model/repairRequestModel");
const notes = require("../../model/notesModel");
const Notification = require("../../model/notificationModel");

exports.getAssignedRequests = async (req, res) => {
  try {
    const technicianId = req.user.id;
    const assignedRequests = await repairRequest.find({ technicianId });
    return res.status(200).json(assignedRequests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resolveRequest = async (req, res) => {

    const requestId = req.params.id;
    const { status,estimatedCost } = req.body;

    if (status === "pending") {
      return res.status(400).json({ message: "Cannot change status back to pending" });
    }

    const existingRequest = await repairRequest.findById(requestId);

    if (!existingRequest) {
      return res.status(404).json({ message: "Repair request not found" });
    }

    if (existingRequest.technicianId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to resolve this request" });
    }

    existingRequest.status = status;
    await existingRequest.save();

    // notify customer about status change
    if (existingRequest.requestedBy) {
      await Notification.create({
        requestId,
        recipient: existingRequest.requestedBy,
        type: "status_change",
        message: `Your repair request ${existingRequest.serviceCode || ""} status changed to ${status}`.trim(),
      });
    }

    const notesExist = await notes.findOne({ requestId });

    if (!notesExist) {
      await notes.create({
        requestId,
        description: "Your request has been updated",
        estimatedCost
      });

      return res.status(200).json({ message: "Notes created successfully" });
    }

    return res.status(200).json({ message: "Request marked successfully" });
  } ;


exports.addNotes = async (req, res) => {
    const requestId = req.params.id;
    const { description } = req.body;
    const files = req.files || [];

    const existingRequest = await repairRequest.findById(requestId);

    if (!existingRequest) {
      return res.status(404).json({ message: "Repair request not found" });
    }

    if (existingRequest.technicianId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to add notes to this request" });
    }

    const images = files.map((file) => {
      return process.env.BACKEND_URL
        ? process.env.BACKEND_URL + file.filename
        : file.path;
    });

    await notes.create({
      requestId,
      description,
      images,
    });

    // notify customer that technician added notes
    if (existingRequest.requestedBy) {
      await Notification.create({
        requestId,
        recipient: existingRequest.requestedBy,
        type: "notes_added",
        message: `Technician added an update to your repair request ${existingRequest.serviceCode || ""}`.trim(),
      });
    }

    return res.status(200).json({ message: "Notes added successfully" });
}  