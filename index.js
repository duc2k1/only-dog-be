const express = require("express");
const app = express();
const PORT = process.env.PORT || 6969;

app.get("/", (res, req) => {
	req.send("<h1>ok</h1>");
});
app.listen(PORT, () => console.log("Listening port: " + PORT));
