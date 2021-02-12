const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST']
  }
});

// when a client (browser) connects to the server
io.on('connection', async (socket) => {
  const {channel} = socket.handshake.query

  // add this client to the channel they requested
  socket.join(channel)

  // emit all active peer ids in this channel
  const ids = Array.from(await io.in(channel).allSockets())
  socket.emit('participants', ids)

  // relay signals between peers
  socket.on('signal', (remotePeerId, signal) => {
    io.to(remotePeerId).emit('signal', socket.id, signal)
  })

  // debugging
  // socket.onAny((event) => {
  //   console.debug(`got ${event}`);
  // });

})

io.listen(process.env.PORT || 3000)
