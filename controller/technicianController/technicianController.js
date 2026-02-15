const repairRequest = require("../../model/repairRequestModel");
const notes = require("../../model/notesModel");
const Notification = require("../../model/notificationModel");
const Payment = require("../../model/paymentModel");

exports.getAssignedRequests = async (req, res) => {
  try {
    const technicianId = req.user.id;
    const assignedRequests = await repairRequest.find({ technicianId }); 
    const withPayment = await Promise.all(
      assignedRequests.map(async (r) => {
        const doc = r.toJSON ? r.toJSON() : r;
        const payment = await Payment.findOne({ requestId: r._id }).lean();
        doc.paymentStatus = payment ? payment.status : null;
        doc.paymentAmount = payment ? payment.amount : null;
        return doc;
      })
    );
    return res.status(200).json(withPayment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAssignedRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const technicianId = req.user.id;
    const request = await repairRequest.findOne({ _id: requestId, technicianId });
    if (!request) {
      return res.status(404).json({ message: "Repair request not found" });
    }
    const doc = request.toJSON ? request.toJSON() : request;
    const payment = await Payment.findOne({ requestId: request._id }).lean();
    doc.paymentStatus = payment ? payment.status : null;
    doc.paymentAmount = payment ? payment.amount : null;
    return res.status(200).json(doc);
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

    if (existingRequest.status === "completed") {
      return res.status(400).json({ message: "Completed requests cannot be updated" });
    }

    existingRequest.status = status;
    await existingRequest.save();

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

    if (existingRequest.status === "completed") {
      return res.status(400).json({ message: "Completed requests cannot be modified; add notes is not allowed" });
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