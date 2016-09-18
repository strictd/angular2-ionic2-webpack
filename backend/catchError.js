(function() {
  exports.die = function(res, err) {
    res.status(500).send({error: err});
  }
  exports.emitAuth = function(socket, socketTag) {
    socket.emit('socketReturn', {socketTag: socketTag, error: 'no auth'});
  }
})()
