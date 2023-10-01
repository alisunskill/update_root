const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    cb(null, uniqueId + file.originalname);
  },
});

const upload = multer({ storage });
console.log(storage.filename,'storage');
module.exports = upload;
