const express = require("express");
require("@tensorflow/tfjs-node");
const cors = require("cors");
const configureBrowserPolyFills = require("./configs/configureBrowserPolyFills");
const configureEndPoints = require("./configs/configureEndPoints");
const configureBodyParser = require("./configs/configureBodyParser");
const PORT = process.env.PORT || 6969;

const app = express();

app.use(cors());
configureBodyParser(app);
configureEndPoints(app);
configureBrowserPolyFills();

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
