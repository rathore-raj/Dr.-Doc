const express = require("express");
const merge = require("easy-pdf-merge");
const convertapi = require("convertapi")(process.env.CONVERTAPI_SECRET);//Add convertapi Secret Key
const { upload } = require("../middleware/multer.js");
const router = express.Router();
const {uploads} = require('../middleware/multerForGV')
var path = require('path');
var appDir = path.dirname(require.main.filename);
const gVision = require("../js/gVision");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/merge",upload.array("avatar"),(req, res) => {
    const paths = req.files.map((file) => file.path);
    merge(paths,`${appDir}/public/output/Merged-${req.files[0].originalname}`,(err) => {
        if (err) {
         throw new Error(err)
        }
        res.send("Success!");
      }
    );
  },(error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

router.post("/convert", upload.single("avatar"), (req, res) => {
  if (
    !req.file.originalname.match(/\.(doc||docx||ppt||odt||html||xlsv||xlsx)/)
  ) {
    console.log("Upload Document File!");
    throw new Error("Upload Document File!");
  } else {
    convertapi
      .convert("pdf", { File: req.file.path})
      .then((result) => {
        console.log("Result", result.file.fileInfo);
        res.send({ File_Download_Link: result.file.fileInfo.Url });
      })
      .catch((error) => {
        res.status(400).send({ error: error });
      });
  }
});


router.post("/upload", uploads, async(req, res, next) => {

  try{
    const text = await gVision(req.file.path);
    // fs.unlink(req.file.path, err => {
    //     if (err) return console.log(err);
    //     console.log('photo deleted');
    // });
    res.status(200).json({
        text, 
        filename: req.file.filename
    }); 
  }catch(e){
    res.send({Error:e.message})
  }
  
});

module.exports = router;
