const room = "chat";

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe(room);
    peer.publish(room, '{username: "Anonymous", message: "joined chat"}');
  },
  close(peer) {
    console.log("closed ws");
  },
  error(peer, error) {
    console.log("error!", peer, error);
  },
  message(peer, message) {
    peer.publish(room, message.text());
  },
});
