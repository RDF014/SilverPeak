const https = require('https');
const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 1337;

const options = {
  key: fs.readFileSync('credentials/client-key.pem'),
  cert: fs.readFileSync('credentials/client-cert.pem')
};

const testHanderHash = {};

class testHandle {
  constructor(handler, sites, iterations) {
    this.handler = handler;
    this.sites = sites;
    this.iterations = iterations;
  }

  init() {
    this.checkIterations();
  }

  checkIterations() {
    if ( this.iterations !== 0) {
      console.log(this.iterations);
      this.getResponseTime(0);
    }
  }

  getResponseTime(idx) {
    if (idx === this.sites.length) {
      this.iterations--;
      return this.checkIterations();
    }
    const start = new Date();
    http.get(this.sites[idx], () => {
      console.log(this.sites[idx], new Date() - start);
      this.getResponseTime(++idx);
    });
  }
}

const getResponseTime = (data, callback) => {
  console.log('here');
  callback(data);
};

const endPoints = {
  '/startTest': (req, res, data) => { 
    const start = new Date();

    testHanderHash['1111'] = new testHandle('1111', data.sitesToVisit, data.iterations);
    testHanderHash['1111'].init();

    res.writeHead(201);
    res.end(JSON.stringify(new Date() - start));
  }
};
// res.writeHead(201);
// res.end(rawData);

const actionHandler = {
  POST: (req, res) => {
    let rawData = '';
    req.on('data', (chunk) => {
      rawData += chunk;
    });
    req.on('end', () => {
      // do something with raw data. 
      endPoints[req.url](req, res, JSON.parse(rawData));
    });
  },
  GET: (req, res) => {
    // do something with GET request.
  }
};

const requestHandler = (req, res) => {
  console.log(req.url, req.method);
  actionHandler[req.method](req, res);
};

const a = https.createServer(options, requestHandler)
.listen(port);