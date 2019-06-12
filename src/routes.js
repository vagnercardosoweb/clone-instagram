const router = require("express").Router();

const multer = require("multer");
const multerConfig = require("./config/multer");
const multerUpload = multer(multerConfig);

const PostController = require("./controllers/PostController");

router.get("/posts/:id?", PostController.index);
router.post("/posts", multerUpload.single("image"), PostController.store);
router.delete("/posts/:id", PostController.delete);
router.post("/posts/:id/like", PostController.like);

module.exports = router;
