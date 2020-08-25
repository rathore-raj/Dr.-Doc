const multer = require('multer')

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, "./src/public/files");
    // },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(pdf||doc||docx)/)) {
        return cb(new Error("Upload PDF File!"));
      }
      cb(undefined, true);
    },
  });

  module.exports = {
    upload
  }
