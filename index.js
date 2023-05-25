const io = require("socket.io")(8900, {
  cors: {
    origin: "https://main.d20gjfk4zk29ix.amplifyapp.com",
    // origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //  io.emit("welcome","hello this is socket server")
  //take userid and socket id from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and getMessage
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    // io.to(user.socketId).emit("getMessage", {
    //   senderId,
    //   text,
    // });
  });

  //when disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
