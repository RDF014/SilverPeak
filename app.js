const https = require('https');
const fs = require('fs');

const port = process.env.PORT || 1337;

const options = {
  key: fs.readFileSync('credentials/client-key.pem'),
  cert: fs.readFileSync('credentials/client-cert.pem')
};

const requestHandler = (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
};

const a = https.createServer(options, requestHandler)
.listen(port);