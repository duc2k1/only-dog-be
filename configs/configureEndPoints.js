const fs = require("fs");
const tmImage = require("@teachablemachine/image");
const canvas = require("canvas");

module.exports = function configureEndPoints(app) {
  addEndpoint(
    app,
    "test",
    "https://teachablemachine.withgoogle.com/models/wNpy2osdc/"
  );
};

async function addEndpoint(app, name, baseUrl) {
  const modelURL = baseUrl + "model.json";
  const metadataURL = baseUrl + "metadata.json";
  const model = await tmImage.load(modelURL, metadataURL);
  app.post("/" + name, (request, response) => {
    console.log(request.headers);
    const base64Image = Buffer.from(request.body).toString("base64");
    const contentType = request.get("Content-Type");
    getPrediction(model, base64Image, contentType, (output) => {
      response.send(output);
      if (output[0].probability > output[1].probability) {
        fs.writeFile("helloworld.jpeg", request.body, function (err) {
          if (err) return console.log(err);
          console.log("Saveddd");
        });
      } else {
        console.log("Not saved");
      }
    });
  });
}

async function getPrediction(model, imageData, contentType, responseFunction) {
  const imageCanvas = canvas.createCanvas(64, 64);
  const canvasContext = imageCanvas.getContext("2d");

  const canvasImage = new canvas.Image();
  canvasImage.onload = async () => {
    canvasContext.drawImage(canvasImage, 0, 0, 64, 64);

    const prediction = await model.predict(imageCanvas);
    console.log(prediction);
    responseFunction(prediction);
  };

  canvasImage.onerror = (error) => {
    throw error;
  };

  canvasImage.src = `data:${contentType};base64,` + imageData;
}
