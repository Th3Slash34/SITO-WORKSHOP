const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;
const dir = __dirname;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.js': 'application/javascript',
  '.css': 'text/css',
};

http.createServer((req, res) => {
  let p = path.join(dir, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(p)] || 'text/plain' });
    res.end(data);
  });
}).listen(port, () => console.log(`Server attivo su http://localhost:${port}`));
