var net = require('net');

var client = net.connect({ port: 4001 }, function () {
  console.log('client connected');
  client.write('world!\r');
});

module.exports = function (socketEmitter) {
  client.on('data', function (data) {
    console.log(data.toString());
  });
  client.on('end', function () {
    console.log('client disconnected');
  });
};
