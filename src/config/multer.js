const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

module.exports = {
  storage: new multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
    filename: (req, file, callback) => {
      crypto.randomBytes(12, (err, hash) => {
        if (err) {
          callback(err);
        } else {
          file.hash = `${hash.toString("hex")}-${file.originalname}`;
          callback(null, file.hash);
        }
      });
    }
  })
};
