const { Server } = require("socket.io");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });
  });

  return io;
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
};
