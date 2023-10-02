const multer = require("multer");
const moment = require("moment");
const path = require("path");
let fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid"); // for naming files with random characters
let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    let url = `/public/storage/${req.query.name}/${moment(
      req.query.date
      ).format("DD-MM-YYYY")}/${req.body.service}`;
      
      fs.mkdirsSync(url);
      // url = path.join(__dirname, url)
    cb(null, url);
  },

  filename: function (req, file, cb) {
    cb(null, req.body.acte +" - "+ uuidv4() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|pdf)$/)) {
    return cb(
      new Error(
        "Invalid file type, only JPEG, PNG, JPG, gif, svg, pdf are allowed!"
      ),
      false
    );
  }
  cb(undefined, true);
};
const upload = multer({
  storage,
  limits: {
    fileSize: 100000000,
  },
  fileFilter,
});
module.exports = {
  upload,
};
