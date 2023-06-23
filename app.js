require('console-stamp')(console, { pattern: 'yyyy/mm/dd HH:MM:ss.l' });
const process = require('process');
const express = require('express');
const http = require("http");
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
process.on('exit', (code) => {
  console.log(`[51MEET] process exit with code: ${code}`);
});
process.on('uncaughtException', (err, origin) => {
  console.error(`[51MEET] Caught exception: ${err}\n` + `Exception origin: ${origin}`);

});
process.on('unhandledRejection', (reason, promise) => {
  console.error(`[51MEET] Unhandled Rejection at: ${promise}, reason: ${reason}`);
});
const rootdir = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(rootdir, '/configs/config.json'), 'UTF8'));
console.log(config);

let proxyObj = {};
if (process.env.NODE_ENV && process.env.NODE_ENV == "development") {
  console.log(process.env.NODE_ENV);
  proxyObj.baseURL = "http://" + config.serverHostDev;
  proxyObj.basePort = config.serverPortDev;
} else if (process.env.NODE_ENV && process.env.NODE_ENV == "staging") {
  console.log(process.env.NODE_ENV);
  proxyObj.baseURL = "http://" + config.serverHostStaging;
  proxyObj.basePort = config.serverPortStaging;
} else if (process.env.NODE_ENV && process.env.NODE_ENV == "test") {
  console.log(process.env.NODE_ENV);
  proxyObj.baseURL = "http://" + config.serverHostTest;
  proxyObj.basePort = config.serverPortTest;
} else if (process.env.NODE_ENV && process.env.NODE_ENV == "k8s") {
  console.log("k8s");
  proxyObj.baseURL = (config.enableHttps ? "https://" : "http://") + config.serverHost;
  proxyObj.basePort = config.serverPort;
} else {
  console.log("production");
  proxyObj.baseURL = (config.enableHttps ? "https://" : "http://") + config.serverHost;
  proxyObj.basePort = config.serverPort;
}
const app = express();
app.use(compression());
const server = http.createServer(app);
server.listen(config.port);

let proxyOptions = {
  target: proxyObj.baseURL + (proxyObj.basePort === 443 || proxyObj.basePort === 80 ? "" : `:${proxyObj.basePort}`),
  changeOrigin: true,
  secure: false,
  headers: {
    Referer: proxyObj.baseURL + (proxyObj.basePort === 443 || proxyObj.basePort === 80 ? "" : `:${proxyObj.basePort}`),
  },
  agent: (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') && config.enableHttps ? { rejectUnauthorized: false } : undefined,
  onProxyReq (proxyReq, req, res) {
    let remoteIP = req.connection.remoteAddress || req.headers['x-forwarded-for'];
    remoteIP = remoteIP.replace(/^.*:/, '');
    if (remoteIP === '1') {
      remoteIP = '127.0.0.1';
    }
    proxyReq.setHeader('clientip', remoteIP);
  }
}
let proxy = createProxyMiddleware({
  pathRewrite: {
    '^/api': ''
  },
  ...proxyOptions
});
app.use('/api', proxy);
app.use(express.static(path.resolve(__dirname, './dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/healthy', (req, res) => {
  res.status(200).json({ success: true })
});
app.get('*', (req, res) => {
  let html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
  res.send(html);
});