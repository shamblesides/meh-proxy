const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer();

const httpServer = http.createServer(function(request, response) {
  proxy.web(request, response, { target: process.env.URL, secure: false, changeOrigin: true }, (err) => {
    console.log(`request error: ${err.message}`)
  });
});

httpServer.on('upgrade', function upgrade(request, socket, head) {
  proxy.ws(request, socket, head, { target: process.env.URL, secure: false, changeOrigin: true }, (err) => {
    console.error(`socket upgrade error: ${err.message}`)
  })
})

const listener = httpServer.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(`Failed to start: ${err}`);
    process.exit(1);
  } else {
    console.log(`Proxy listening on port ${listener.address().port}`)
  }
})
