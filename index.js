const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 6969;

app.get("/", (res, req) => {
	req.sendFile(path.join(__dirname + "/html/index.html"));
});

app.get("/user", (res, req) => {
	req.send([
		{
			id: 1,
			name: "Duc",
		},
		{
			id: 2,
			name: "Tai",
		},
	]);
});

app.listen(PORT, () => console.log("Listening port: " + PORT));
