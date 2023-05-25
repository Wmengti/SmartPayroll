const fs = require('fs');

const writeFile = (filename, chain, address) => {
  fs.readFile(filename, function (err, data) {
    let jsonData = {};
    if (data) {
      jsonData = JSON.parse(data?.toString());
    }
    jsonData[chain] = address;

    console.log(jsonData);
    fs.writeFile(filename, JSON.stringify(jsonData), function (err) {
      if (err) {
        console.error(err);
      }
    });
  });
};

module.exports = { writeFile };
