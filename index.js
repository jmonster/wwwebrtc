const io = require('socket.io')()

// when a client (browser) connects to the server
io.on('connection', socket => {

  // server receives a 'signal' addressed to 'remotePeerId' and replays it to them
  // the sender of this message is implied by whomever is connected on 'socket'
  // i.e. the sender is 'socket.id'
  socket.on('signal', (remotePeerId, signal) => {
    io.to(remotePeerId).emit('signal', socket.id, signal)
  })

  // After a browser connects, they may send a 'join' message.
  // 'channelSecret' represents a particular/unique multiparty call.
  socket.on('join', async ({channelSecret}) => {
    // all sockets in the 'call' namespace and in the 'channelSecret' room
    const ids = await io.in(channelSecret).allSockets()
    // TODO omit current socket from collection?
    socket.emit('peersAvailable', ids)
    socket.join(channelSecret)
  })
  
})

io.listen(process.env.PORT || 3000)
