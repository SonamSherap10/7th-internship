const repairRequest = require("../../model/repairRequestModel");
const users = require("../../model/userModel");
const Payment = require("../../model/paymentModel");
const Notification = require("../../model/notificationModel");
const category = require("../../model/repairCategoryModel");

exports.getCustomers = async (req, res) => {
  const list = await users.find({ role: "user" }).select("-password");
  return res.status(200).json(list);
};

exports.getTechnicians = async (req, res) => {
  const list = await users.find({ role: "technician" }).select("-password");
  return res.status(200).json(list);
};

exports.getCategories = async (req, res) => {
  const list = await category.find();
  return res.status(200).json(list);
};

// Create repair request on behalf of a customer, optionally assign a technician
exports.createRequestForCustomer = async (req, res) => {
  const { customerId } = req.params;
  const { name, email, phone, address, deviceModel, description, categoryId, technicianId } =
    req.body;

  const serviceCode = `SRV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  if (!name || !email || !phone || !address || !deviceModel || !description || !categoryId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // if technicianId is provided, validate it
  let assignedTech = null;
  if (technicianId) {
    assignedTech = await users.findById(technicianId);
    if (!assignedTech || assignedTech.role !== "technician") {
      return res.status(400).json({ message: "Invalid technician ID" });
    }
  }

  const request = await repairRequest.create({
    name,
    email,
    deviceModel,
    phone,
    address,
    description,
    categoryId,
    serviceCode,
    requestedBy: customerId,
    technicianId: technicianId || undefined,
  });

  // notify technician if assigned
  if (assignedTech) {
    await Notification.create({
      requestId: request._id,
      recipient: technicianId,
      type: "assigned",
      message: `You have been assigned to repair request ${serviceCode}`,
    });
  }

  return res.status(201).json({
    message: "Repair request created successfully",
    serviceCode,
    request,
  });
};

// View completed repair requests that are awaiting payment (status completed, no paid record)
exports.getCompletedRequestsAwaitingPayment = async (req, res) => {
  const completedRequests = await repairRequest
    .find({ status: "completed" })
    .lean();

  if (completedRequests.length === 0) {
    return res.status(404).json({ message: "No completed requests found" });
  }

  // find payments for these requests
  const requestIds = completedRequests.map((r) => r._id);
  const payments = await Payment.find({ requestId: { $in: requestIds } }).lean();

  const paymentsByRequest = payments.reduce((acc, p) => {
    acc[p.requestId.toString()] = p;
    return acc;
  }, {});

  const awaitingPayment = completedRequests.filter((reqItem) => {
    const p = paymentsByRequest[reqItem._id.toString()];
    return !p || p.status !== "paid";
  });

  return res.status(200).json(awaitingPayment);
};

// Mark or create payment for a request (Pending or Paid) - COD
exports.updatePaymentStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status, amount, paymentMethod } = req.body; // status: pending / paid

  if (!status || !["pending", "paid"].includes(status)) {
    return res.status(400).json({ message: "Status must be 'pending' or 'paid'" });
  }

  if (typeof amount !== "number") {
    return res.status(400).json({ message: "Amount must be a number" });
  }

  const request = await repairRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Repair request not found" });
  }

  let payment = await Payment.findOne({ requestId });
  if (!payment) {
    payment = await Payment.create({
      requestId,
      status,
      amount,
      receivedBy: req.user.id,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });
  } else {
    payment.status = status;
    payment.amount = amount;
    payment.receivedBy = req.user.id;
    payment.paymentMethod = paymentMethod || payment.paymentMethod || "Cash on Delivery";
    await payment.save();
  }

  // notify customer that payment status was updated
  if (request.requestedBy) {
    await Notification.create({
      requestId,
      recipient: request.requestedBy,
      type: "payment_update",
      message: `Payment status for your repair request ${request.serviceCode || ""} is now ${status}`.trim(),
    });
  }

  return res.status(200).json({
    message: "Payment updated successfully",
    payment,
  });
};


