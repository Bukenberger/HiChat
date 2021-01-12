const matColours = require("./colours.json");

// user/room arrays
let users = ["admin"];
let rooms = ["main"];
let colours = { admin: "#475a9e" };
let onlineList = {
  main: [],
};

const addUser = (clientName, roomName) => {
  // add user name to list of users
  let userColour =
    matColours.colours[
      Math.floor(Math.random() * matColours.colours.length) + 1
    ];
  users.push(clientName);
  colours[clientName] = userColour;

  let list = onlineList[roomName];
  let payload = { name: clientName, colour: userColour };

  if (list === undefined) {
    onlineList[roomName] = [];
    onlineList[roomName].push(payload);
  } else {
    list.push(payload);
    onlineList[roomName] = list;
  }
};

const getUserColour = (clientName) => {
  return colours[clientName];
};

const removeUser = (clientName, roomName) => {
  // remove user from array
  let index = users.indexOf(clientName);
  if (index > -1) {
    users.splice(index, 1);
  }

  for (let i = 0; i < onlineList[roomName].length; ++i) {
    if (onlineList[roomName][i].name === clientName) {
      onlineList[roomName].splice(i, 1);
    }
  }
};

const userExists = (clientName) => {
  return users.includes(clientName);
};

const getUsers = () => {
  return users;
};

const roomExists = (clientName) => {
  return rooms.includes(clientName);
};

const addRoom = (roomName) => {
  if (!rooms.includes(roomName)) rooms.push(roomName);
};

const getRooms = () => {
  return rooms;
};

const getOnlineList = (roomName) => {
  return onlineList[roomName];
};

module.exports = {
  addUser,
  removeUser,
  getUserColour,
  userExists,
  getUsers,
  addRoom,
  roomExists,
  getRooms,
  getOnlineList,
};
