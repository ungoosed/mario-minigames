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
        index: rooms[roomsArr[i].users.indexOf(foundUser)],
      };
    }
  }
  return undefined;
}

export default defineWebSocketHandler({
  open(peer) {
    let uuid = uuidv4();
    users[uuid] = peer;
    peer.send(JSON.stringify({ type: "uuid", content: uuid }));
  },
  close(peer) {
    let userData = findUser(
      Object.keys(users).find((key) => users[key] === peer),
    );
    if (userData) {
      rooms[userData.roomKey].users.splice(userData.index, 1);
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
      if (content.type == "roomData") {
        // params: type, uuid, content: {type: "roomData", roomKey}
        let userData = findUser(meta.uuid);
        if (userData.roomKey == content.roomKey) {
          peer.send(
            JSON.stringify({
              type: "data",
              content: {
                type: "newroomdata",
                data: { roomKey: userData.roomKey, users: target.users },
              },
            }),
          );
        }
      }
    }
    if (meta.type == "createroom") {
      // params: type, content: {roomKey, maxUsers}
      if (!Object.hasOwn(rooms, content.roomKey)) {
        rooms[content.roomKey] = {
          maxUsers: content.maxUsers,
          users: [],
          data: { turn: null, game: null },
        };
      }
    }
    if (meta.type == "join") {
      // params: type, uuid, content: {roomKey, name}
      let target = rooms[content.roomKey];
      if (target.users.length < target.maxUsers) {
        target.users.push({ uuid: meta.uuid, name: content.name });
        let userNameList = target.users.flatMap((user) => {
          return user.name;
        });
        peer.subscribe(content.roomKey);
        peer.publish(
          content.roomKey,
          JSON.stringify({
            type: "data",
            content: {
              type: "roomData",
              data: { roomKey: content.roomKey, users: userNameList },
            },
          }),
        );
      } else {
        peer.send(JSON.stringify({ type: "error", reason: "room full" }));
      }
    }
    if (meta.type == "leave") {
      // params: type, uuid, content: {roomKey}
      let userData = findUser(meta.uuid);

      if (userData) {
        rooms[userData.roomKey].users.splice(userData.index, 1);
      }
    }
  },
});
// roomData structure:
// {}
