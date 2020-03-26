const io = require('socket.io')()

io.on('connection', socket => {
  socket.on('join', ({signalId}) => {
    socket.join(signalId)
    socket.on('signal', (signal) => {
      socket.broadcast.to(signalId).emit('signal', signal)
    })
  })
})

io.listen(3000)
