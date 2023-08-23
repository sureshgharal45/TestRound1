const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log(`Mongodb connected ${mongoose.connection.host}`);
};

module.exports = connectDB;
