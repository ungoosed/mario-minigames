import { v4 as uuidv4 } from "uuid";
const room = "minigames";
const activeGames = [];
const users = {};

export default defineWebSocketHandler({
  open(peer) {
    let uuid = uuidv4();
    users[uuid] = peer;
    peer.send(JSON.stringify({ type: "uuid", content: uuid }));
  },
  close(peer) {
    console.log("closed ws");
  },
  error(peer, error) {
    console.log("error!", peer, error);
  },
  message(peer, message) {
    let parsed = JSON.parse(message);

    if (!("type" in parsed)) {
      peer.send(JSON.stringify({ type: "error", reason: "malformed request" }));
      return;
    }
    if (parsed.type == "request") {
      if (parsed.content.type == "roomList") {
        // params: type, content: {request}
        let roomList = [];
        for (let i = 0; i < activeGames.length; i++) {
          roomList.push({
            roomKey: activeGames[i].roomKey,
            numUsers: activeGames[i].users.length,
          });
        }
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
    }
    if (parsed.type == "newroom") {
      // params: type, content: {roomkey}
      let used = false;
      for (let i = 0; i < activeGames.length; i++) {
        if (activeGames[i].roomKey === parsed.content.roomKey) {
          used = true;
        }
      }
      if (!used) {
        activeGames.push({
          roomKey: parsed.content.roomKey,
          users: {},
          data: { turn: null, game: null },
        });
      }
    }
    if (parsed.type == "join") {
      // params: type, uuid, content: {roomkey, name}
      // return uuid
      let roomNum = activeGames.findIndex(
        (item) => item.roomKey == parsed.content.roomKey,
      );
      if (
        activeGames[roomNum].users.length <= 4 &&
        users[parsed.uuid] == peer
      ) {
        activeGames[roomNum].users[parsed.content.uuid] = parsed.content.name;
        peer.subscribe(activeGames[roomNum].roomKey);
      } else {
        peer.send(JSON.stringify({ type: "error", reason: "room full" }));
      }
    }
  },
});
