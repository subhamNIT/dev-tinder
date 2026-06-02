const { SESClient } = require("@aws-sdk/client-ses");
const REGION = "eu-north-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY;

const sesClient = new SESClient({ region: REGION,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
 });

module.exports = {sesClient};
// snippet-end:[ses.JavaScript.createclientv3]