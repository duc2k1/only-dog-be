const express = require("express");
const app = express();
const PORT = 6969 || process.env.PORT;

app.get("/", (res, req) => {
	req.send("<h1>ok</h1>");
});
app.listen(PORT, () => console.log("Listening port: " + PORT));
