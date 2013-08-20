/* test server */

var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(connect.static('test'))
  .use(connect.directory('test'));

http.createServer(app).listen(3000);