const Notification = require("../../model/notificationModel");

exports.getMyNotifications = async (req, res) => {
  const { onlyUnread } = req.query;

  const query = { recipient: req.user.id };
  if (onlyUnread === "true") {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .populate("requestId");

  return res.status(200).json(notifications);
};

exports.markNotificationRead = async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  if (notification.recipient.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not allowed to update this notification" });
  }

  notification.isRead = true;
  await notification.save();

  return res.status(200).json({ message: "Notification marked as read" });
};

