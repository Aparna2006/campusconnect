const { Server } = require("socket.io");

let io;

const initSocket = (httpServer) => {
  const configuredOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const fixedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
  const vercelCampusConnectOrigin = /^https:\/\/campusconnect(?:-[a-z0-9-]+)?\.vercel\.app$/i;
  const allowedOrigins = new Set([...fixedOrigins, ...configuredOrigins]);
  const isAllowedOrigin = (origin) =>
    allowedOrigins.has(origin) || vercelCampusConnectOrigin.test(origin);

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Socket CORS policy blocked this origin"));
      },
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
