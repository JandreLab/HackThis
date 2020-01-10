const fse = require("fs-extra");
const tesseract = require("node-tesseract-ocr");

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
