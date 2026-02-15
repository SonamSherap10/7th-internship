const notes = require("../../model/notesModel");
const repairRequest = require("../../model/repairRequestModel");

exports.getNotesForRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = await repairRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Repair request not found" });
  }
  const userId = req.user.id || req.user._id?.toString();
  const isAdmin = req.user.role === "admin";
  const isReceptionist = req.user.role === "receptionist";
  const isOwner = request.requestedBy && request.requestedBy.toString() === userId;
  const isTechnician = request.technicianId && request.technicianId.toString() === userId;
  if (!isAdmin && !isReceptionist && !isOwner && !isTechnician) {
    return res.status(403).json({ message: "Not authorized to view notes for this request" });
  }
  const list = await notes.find({ requestId }).sort({ createdAt: 1 });
  return res.status(200).json(list);
};
