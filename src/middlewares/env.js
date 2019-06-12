const path = require("path");
const fs = require("fs");

module.exports = async (req, res, next) => {
  const envPath = path.resolve(__dirname, "..", "..", ".env");
  const envExamplePath = path.resolve(__dirname, "..", "..", ".env-example");

  await fs.access(envPath, "utf8", err => {
    if (err) {
      fs.readFile(envExamplePath, (err, content) => {
        fs.writeFile(envPath, content, () => {});
      });
    }
  });

  next();
};
