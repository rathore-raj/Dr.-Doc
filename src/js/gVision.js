// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Read a local image as a text document
const doc_detect = async filename => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.documentTextDetection(filename);
    const fullTextAnnotation = result.fullTextAnnotation;
    return fullTextAnnotation.text;
};

module.exports = doc_detect;
