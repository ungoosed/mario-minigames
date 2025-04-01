import { v4 as uuidv4 } from "uuid";
const rooms = {};
const users = {};

function findUser(uuid) {
  let roomsArr = Object.keys(rooms);
  for (let i = 0; i < roomsArr.length; i++) {
    let foundUser = rooms[roomsArr[i]].users.find((usr) => usr.uuid == uuid);
    if (foundUser) {
      return {
        user: foundUser,
        roomKey: roomsArr[i],
        index: rooms[roomsArr[i]].users.indexOf(foundUser),
      };
    }
  }
  return undefined;
}
function getGameState(roomKey) {
  let publicUserList = [];
  rooms[roomKey].users.forEach((usr) => {
    publicUserList.push({
      name: usr.name,
      id: usr.id,
      points: usr.points,
    });
  });
  return {
    type: "data",
    content: {
      type: "gameState",
      data: {
        password: rooms[roomKey].password,
        roomKey: roomKey,
        users: publicUserList,
        data: rooms[roomKey].data,
      },
    },
  };
}
function broadcastGameState(roomKey, peer) {
  let gs = getGameState(roomKey);
  peer.publish(roomKey, JSON.stringify(gs));
  peer.send(JSON.stringify(gs));
}
function sendGameState(roomKey, peer, data) {
  let gs = getGameState(roomKey);
  gs.content.data.data = data;
  peer.send(JSON.stringify(gs));
}
function forwardAction(roomKey, id, action) {
  let host = users[rooms[roomKey].users[0].uuid];
  host.send(JSON.stringify({ type: "try", id: id, data: action }));
}
export default defineWebSocketHandler({
  open(peer) {
    let uuid = uuidv4();
    let id = uuidv4();
    users[uuid] = peer;
    users[id] = peer;
    peer.send(JSON.stringify({ type: "uuid", content: [uuid, id] }));
  },
  close(peer) {
    let userData = findUser(
      Object.keys(users).find((key) => users[key] == peer),
    );
    if (userData) {
      rooms[userData.roomKey].users.splice(userData.index, 1);
      peer.unsubscribe(userData.roomKey);
      broadcastGameState(userData.roomKey, peer);
      if (rooms[userData.roomKey].users.length < 1) {
        delete rooms[userData.roomKey];
      }
    }
  },
  error(peer, error) {
    console.log("error!", peer, error);
  },
  message(peer, message) {
    let meta = JSON.parse(message);
    let content = meta.content;
    if (!("type" in meta)) {
      peer.send(JSON.stringify({ type: "error", reason: "malformed request" }));
      return;
    }
    if (meta.type == "request") {
      if (content.type == "roomList") {
        // params: type, content: {request}
        let roomList = Object.keys(rooms).map((key) => {
          return {
            roomKey: key,
            password: rooms[key].password == "none" ? false : true,
            maxUsers: rooms[key].maxUsers,
            currentUsers: Object.keys(rooms[key].users).length,
          };
        });
        peer.send(
          JSON.stringify({
            type: "data",
            content: {
              type: "roomList",
              data: roomList,
            },
          }),
        );
      }
      if (content.type == "gameState") {
        // params: type, uuid, content: {type: "gameState", roomKey}
        broadcastGameState(content.roomKey, peer);
      }
    }
    if (meta.type == "createroom") {
      // params: type, content: {roomKey, maxUsers}
      if (!Object.hasOwn(rooms, content.roomKey)) {
        rooms[content.roomKey] = {
          maxUsers: content.maxUsers,
          password: content.password,
          users: [],
          data: {},
        };
        console.log("created room");
      }
    }
    if (meta.type == "join") {
      // params: type, id, uuid, content: {roomKey, name, password}
      console.log(rooms[content.roomKey]);
      console.log(content.password);
      if (
        rooms[content.roomKey].password == "none" ||
        rooms[content.roomKey].password == content.password
      ) {
        console.log("success");
        if (!findUser(meta.uuid) && rooms[content.roomKey]) {
          let target = rooms[content.roomKey];
          if (target.users.length < target.maxUsers) {
            target.users.push({
              uuid: meta.uuid,
              id: meta.id,
              name: content.name,
              points: 0,
            });
            peer.subscribe(content.roomKey);
            broadcastGameState(content.roomKey, peer);
          } else {
            peer.send(JSON.stringify({ type: "error", reason: "room full" }));
          }
        }
      }
    }
    if (meta.type == "leave") {
      // params: type, uuid
      let userData = findUser(meta.uuid);
      if (userData) {
        peer.unsubscribe(userData.roomKey);
        rooms[userData.roomKey].users.splice(userData.index, 1);
        broadcastGameState(userData.roomKey, peer);
        if (rooms[userData.roomKey].users.length <= 0) {
          delete rooms[userData.roomKey];
        }
      }
    }
    if (meta.type == "update") {
      // params: type, uuid, content: {roomKey, data}
      if (
        meta.uuid == rooms[content.roomKey]?.users[0].uuid &&
        findUser(meta.uuid)
      ) {
        if (users[content.target]) {
          sendGameState(content.roomKey, users[content.target], content.data);
        } else {
          rooms[content.roomKey].data = content.data;
          broadcastGameState(content.roomKey, peer);
        }
      }
    }
    if (meta.type == "action") {
      // params: type, uuid, id, content: {roomKey, data}
      if (meta.id == findUser(meta.uuid).user.id) {
        forwardAction(content.roomKey, meta.id, content.data);
      }
    }
  },
});
