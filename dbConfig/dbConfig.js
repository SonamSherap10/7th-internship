const mongoose = require("mongoose");
try {
  exports.connectdb = async (URI) => {
    await mongoose.connect(URI);
    console.log("database connected");

  };
} catch (error) {
  console.log(error);
}