require("dotenv").config();
const express = require("express");
const path = require("path");

// Express server
const app = express();

// Middlewares
app.use(require("./middlewares/env"));
app.use(require("./middlewares/cors"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Node server + socket.io
const server = require("http").Server(app);
var io = require("socket.io")(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mongoose
require("./config/mongoose");

// Files
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));

// Routes
app.use(require("./routes"));

server.listen(process.env.PORT || 3333);
