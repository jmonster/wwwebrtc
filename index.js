const io = require('socket.io')()

// when a client (browser) connects to the server
io.on('connection', socket => {

  // server receives a 'signal' addressed to 'remotePeerId' and replays it to them
  // the sender of this message is implied by whomever is connected on 'socket'
  // i.e. the sender is 'socket.id'
  socket.on('signal', (remotePeerId, signal) => {
    io.to(remotePeerId).emit('signal', socket.id, signal)
  })

  // after a browser connects, they may send a 'join' message
  // 'channelSecret' represents a particular/unique multiparty call
  // shared amongst everyone on that call
  socket.on('join', ({channelSecret}) => {
    socket.join(channelSecret)
  })

  // 'aloha' is an arbitrarily named event for when a client
  // is announcing their willingness to connect to other members
  // of the call
  socket.on('aloha', ({channelSecret}) => {
    socket.to(channelSecret).emit('invite', socket.id)
  })

})

io.listen(process.env.PORT || 3000)
