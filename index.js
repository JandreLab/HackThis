const fse = require("fs-extra");
const tesseract = require("node-tesseract-ocr");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const sharp = require("sharp");

let results = [],
  res = [];

function getItems() {
  return fse.readdirSync("images");
}

async function tes(img) {
    console.log(img)
tesseract
    .recognize(`${img}`)
    .then(text => {
      res.push(text);
      console.log(text);
    })
    .catch(error => {
      return error.message;
    });
}

function OpenALPR(originalImage) {
  // file name for cropped image
  let images = getItems();
  images = images.slice(1, images.length);
  var url =
    "https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=0&country=za&secret_key=sk_73dc60d13cc6aa1ff8b9a613";

  images.forEach(element => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    console.log(element);
    var file = new Buffer(fse.readFileSync("images/" + element)).toString(
      "base64"
    );

    xhr.send(file); // Replace with base64 string of an actual image
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log(JSON.parse(xhr.responseText))
        results.push(JSON.parse(xhr.responseText).results[0].plate);
        console.log(results);
        console.log("bla", res);
      } else {
        console.log("Waiting on response...");
      }
    };

    let outputImage = "res/" + element;
    sharp("images/" + element)
      .extract({ width: 400, height: 36, left: 1100, top: 1070 })
      .toFile(outputImage)
      .then(function(new_file_info) {
        tes(outputImage);
        console.log("Image cropped and saved");
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}

OpenALPR();
