const multer = require("multer");
const path = require("path");
const rootPath = path.dirname(require.main.filename);
process.env.GOOGLE_APPLICATION_CREDENTIALS = `${rootPath}/g_client.json`;

const uploads = multer({
    storage: multer.diskStorage({
        // destination: (req, file, cb) => {
        //     cb(null, 'public/upload/');
        // },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            console.log("photo uploaded");
            cb(null, true);
        } else {
            console.log("file not supported");
            cb(null, false);
        }
    }
}).single('photo');

module.exports = {
    uploads
}