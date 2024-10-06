const room = "ROOM";
export default defineWebSocketHandler({
  open(peer) {
    // console.log("opened WS", peer);
    peer.subscribe(room);
    peer.publish(room, "joined chat");
  },
  close(peer) {
    // console.log("closed ws", peer);
  },
  error(peer, error) {
    // console.log("error!", peer, error);
  },
  message(peer, message) {
    // console.log("message on ws", peer, message);
    peer.publish(room, message.text());
    console.log(message.text());
  },
});
