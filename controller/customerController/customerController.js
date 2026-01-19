const repairRequest = require("../../model/repairRequestModel");
const Notification = require("../../model/notificationModel");

exports.addCustomerRequests = async (req, res) => {
    const customerId = req.params.id;
     const {name, email , phone, address, deviceModel, description, categoryId} = req.body;
     const serviceCode = `SRV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
     if(!name || !email || !phone || !address || !deviceModel || !description || !categoryId){
      return res.status(400).json({ message: "All fields are required" });
     }
     await repairRequest.create({
      name,
      email,
      deviceModel,
      phone,
      address,
      description,  
      categoryId,
      serviceCode,
      requestedBy:customerId
     });

     return res.status(201).json({ 
      message: "Repair request created successfully",
      serviceCode: serviceCode}); 
  }

exports.getCustomerRequests = async (req, res) => {
  const customerId = req.params.id;
  const requests = await repairRequest.find({ requestedBy: customerId });
  if(!requests){
    return res.status(404).json({ message: "No requests found for this customer" });
  }
  return res.status(200).json({ requests,requests });
} 

exports.getRequestsByCode = async (req,res)=>{
  const serviceCode = req.body.serviceCode;
  const request = await repairRequest.find({serviceCode});
    if(!request){
    return res.status(404).json({ message: "No requests found for this code" });
  }
  return res.status(200).json({
    message:"Succesfully retreived request",
    data :request
  })

}

exports.cancelRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const request = await repairRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "No request found for this ID" });
    }

    if (!request.requestedBy.equals(req.user.id)) {
      console.log("DB:", request.requestedBy.toString(), "USER:", req.user.id);
      return res.status(403).json({ message: "You are not authorized to cancel this request" });
    }

    request.status = "cancelled";
    await request.save();

    // notify technician if assigned
    if (request.technicianId) {
      await Notification.create({
        requestId: request._id,
        recipient: request.technicianId,
        type: "request_cancelled",
        message: `Customer cancelled repair request ${request.serviceCode || ""}`.trim(),
      });
    }

    return res.status(200).json({ message: "Request cancelled successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};


