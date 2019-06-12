const mongoose = require("mongoose");

try {
  if (!process.env.DB_URL) throw Error("Mongoose not database url configured.");
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
} catch (e) {}

module.exports = mongoose;
