const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer();

function log(request, ...msg) {
  const ipHeader = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  const ip = ipHeader.split(',').pop().trim();
  console.log(new Date().toISOString(), ip, request.url.substr(0, 30).padEnd(30, ' '), ...msg)
}

const httpServer = http.createServer(function(request, response) {
  proxy.web(request, response, { target: process.env.URL, secure: false, changeOrigin: true }, (err) => {
    log(request, `request error: ${err.message}`)
  });
  log(request)
});

httpServer.on('upgrade', function upgrade(request, socket, head) {
  proxy.ws(request, socket, head, { target: process.env.URL, secure: false, changeOrigin: true }, (err) => {
    log(request, `socket upgrade error: ${err.message}`)
  })
  log(request);
})

const listener = httpServer.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(new Date().toISOString(), `Failed to start: ${err}`);
    process.exit(1);
  } else {
    console.log(new Date().toISOString(), `Proxy listening on port ${listener.address().port}`)
  }
})
