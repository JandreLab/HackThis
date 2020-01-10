const fse = require("fs-extra");
const tesseract = require("node-tesseract-ocr");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let results = []
const sharp = require('sharp');

function OpenALPR()
{
    let originalImage = 'images/image (1).png';

// file name for cropped image
let outputImage = 'res/image (1).png';

sharp(originalImage).extract({ width: 400, height: 36, left: 1100, top: 1070 }).toFile(outputImage)
    .then(function(new_file_info) {
        console.log("Image cropped and saved");
    })
    .catch(function(err) {
        console.log(err);
    });
var secret_key = "sk_73dc60d13cc6aa1ff8b9a613";
var url = "https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=za&secret_key=" + secret_key;
var xhr = new XMLHttpRequest();
xhr.open("POST", url);

var file = new Buffer(fse.readFileSync("images/image (1).png")).toString('base64'); 
// console.log(file)

// Send POST data and display response
xhr.send(file);  // Replace with base64 string of an actual image
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        results.push(JSON.parse(xhr.responseText).results[0].plate)
        console.log(results)
        // document.getElementById("response").innerHTML = xhr.responseText;
    } else {
        console.log("Waiting on response...")
        // document.getElementById("response").innerHTML = "Waiting on response...";
    }
}
}
OpenALPR()
let res = []

async function tes(img) {
  return await tesseract
    .recognize(`./images/${img}`)
    .then(text => {
      // console.log("Result:", text)
      res.push(text)
      return text;
    })
    .catch(error => {
      return error.message;
    });
}

function getItems() {
  return fse.readdirSync("images");
}

async function main() {
  let photos = getItems();
  photos.forEach(element => {
     tes(element);
  });

  console.log(res);
}

main();
