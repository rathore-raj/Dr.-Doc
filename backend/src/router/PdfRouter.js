/**
 * PDF manipulation related routes
 */

var path = require("path");

const express = require("express");
const merge = require("easy-pdf-merge");

const ilovepdfSDK = require("ilovepdf-sdk");
const convertapi = require("convertapi")(process.env.CONVERTAPI_SECRET);

// middlewares
const { upload } = require("../middleware/multer.js");
const { uploads } = require("../middleware/multerForGV");

const gVision = require("../js/gVision");

var appDir = path.dirname(require.main.filename);

const sdk = new ilovepdfSDK(
  process.env.ILOVEPDF_PROJECT_PUBLICKEY,
  process.env.ILOVEPDF_PROJECT_SECRETKEY
);

const router = express.Router();

router.post("/compression", upload.single("avatar"), async (req, res) => {
  console.log("file",req.file)
  try {
    const task = await sdk.createTask("compress");
    await task.addFile(req.file.path);
    await task.process({ CompressionLevel: "extreme" });
    await task.download(
      `${appDir}/public/output/compressed-${req.file.originalname}`
    );
    res.status(200).send({ Message: "Compression Successful" });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
});

router.post("/encrypt", upload.single("avatar"), async (req, res) => {
  convertapi
    .convert(
      "encrypt",
      {
        File: req.file.path,
        PdfUserPasswordNew: req.body.password,
        PdfOwnerPasswordNew: req.body.password,
      },
      "pdf"
    )
    .then(function (result) {
      result.saveFiles(
        `${appDir}/public/output/encrypted-${req.file.originalname}`
      );
      res.status(200).send({ Message: "PDF encrypted!" });
    })
    .catch((error) => {
      res.status(400).send({ Error: error.message });
    });
});

router.post("/decrypt", upload.single("avatar"), async (req, res) => {
  convertapi
    .convert(
      "decrypt",
      { File: req.file.path, Password: req.body.password },
      "pdf"
    )
    .then(function (result) {
      result.saveFiles(
        `${appDir}/public/output/decrypted-${req.file.originalname}`
      );
      res.status(200).send({ Message: "PDF decrypted!" });
    })
    .catch((error) => {
      res.status(400).send({ Error: error.message });
    });
});

router.post("/unlock", upload.single("avatar"), async (req, res) => {
  try {
    const task = await sdk.createTask("unlock");
    await task.addFile(req.file.path);
    await task.process();
    await task.download(
      `${appDir}/public/output/Unlocked-${req.file.originalname}`
    );
    res.status(200).send({ Message: "Unlock Successful" });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
});

router.post("/pageNumber", upload.single("avatar"), async (req, res) => {
  try {
    const task = await sdk.createTask("pagenumber");
    await task.addFile(req.file.path);
    await task.process();
    await task.download(
      `${appDir}/public/output/Page_Number_Added-${req.file.originalname}`
    );
    res.status(200).send({ Message: "Page Number Added" });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
});

router.post(
  "/merge",
  upload.array("avatar"),
  (req, res) => {
    const paths = req.files.map((file) => file.path);
    merge(
      paths,
      `${appDir}/public/output/Merged-${req.files[0].originalname}`,
      (err) => {
        if (err) {
          throw new Error(err);
        }
        res.status(200).send({ Message: "Success!" });
      }
    );
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

router.post("/convert", upload.single("avatar"), (req, res) => {
  if (
    !req.file.originalname.match(/\.(doc||docx||ppt||odt||html||xlsv||xlsx)/)
  ) {
    throw new Error("Upload Document File!");
  } else {
    convertapi
      .convert("pdf", { File: req.file.path })
      .then((result) => {
        res.status(200).send({ File_Download_Link: result.file.fileInfo.Url });
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  }
});

router.post("/upload", uploads, async (req, res, next) => {
  try {
    const text = await gVision(req.file.path);
    // fs.unlink(req.file.path, err => {
    //     if (err) return console.log(err);
    //     console.log('photo deleted');
    // });
    res.status(200).send({
      text,
      filename: req.file.filename,
    });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
});

module.exports = router;
