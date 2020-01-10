const fse = require("fs-extra");
const tesseract = require("node-tesseract-ocr");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const sharp = require("sharp");

let results = [],
  res = [];

function getItems() {
    //rename
    let ima = fse.readdirSync("images");
    ima = ima.filter(elem => elem !== '.DS_Store')
    ima.forEach((element, index) => {
        
        let newName = index + '.png'
        fse.renameSync(`images/${element}`, `images/${newName}`)
    });
  return fse.readdirSync("images");
}

function writeLine(line){
    let split = line.split(',')
    fse.appendFileSync('res.csv', "\n" + (split[1] == split[2] ? line += line + ",true" : line += line + ",false"));
}

function tes(img) {
    return tesseract.recognize(`${img}`)
    .then(text => {
        let r = new RegExp(/\s/g);
        let cleanText = text.replace(r, "")
        cleanText = cleanText.replace("PlateNo.:", "")
        return cleanText
      
    })
    .catch(error => {
      return error.message;
    });
}

function OpenALPR(originalImage) {
  // file name for cropped image
  let images = getItems();
  var url =
    "https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=0&country=za&secret_key=sk_73dc60d13cc6aa1ff8b9a613";


  images.forEach(element => {
    let line = element + ',';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    console.log(element);
    var file = new Buffer(fse.readFileSync("images/" + element)).toString(
      "base64"
    );

    xhr.send(file); // Replace with base64 string of an actual image
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        results.push(JSON.parse(xhr.responseText).results[0].plate);
        line += JSON.parse(xhr.responseText).results[0].plate
        writeLine(line)
      } else {
        console.log("Waiting on response...");
      }
    };

    let outputImage = "res/" + element;
    sharp("images/" + element)
      .extract({ width: 400, height: 36, left: 1100, top: 1070 })
      .toFile(outputImage)
      .then(function(new_file_info) {
        tes(outputImage).then(res => line += res + ',');
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}

OpenALPR();
