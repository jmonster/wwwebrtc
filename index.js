const io = require('socket.io')()

io.on('connection', socket => {

  socket.on('signal', (remotePeerId, signal) => {
    io.to(remotePeerId).emit('signal', socket.id, signal)
  })

  socket.on('join', ({channelSecret}) => {
    socket.join(channelSecret)
  })

  socket.on('aloha', ({channelSecret}) => {
    socket.to(channelSecret).emit('invite', socket.id)
  })

})

io.listen(process.env.PORT || 3000)
