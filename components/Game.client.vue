<script setup>
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";
const { status, data, send, open } = useWebSocket(
    `ws://${location.host}/api/minigames`,
);
const uuid = ref("");
const { $bus } = useNuxtApp();
const roomList = useRoomList("roomList");
watch(data, (message) => {
    let parsed = JSON.parse(message);
    if (parsed.type == "uuid") {
        uuid.value = parsed.content;
    }
    if (parsed.type == "data") {
        if (parsed.content.type == "roomList") {
            roomList.value = parsed.content.data;
            $bus.emit("newroomlist");
        }
    }
});
function sendData(type, content) {
    send(JSON.stringify({ type: type, uuid: uuid, content: content }));
}
function refreshRooms() {
    send(JSON.stringify({ type: "request", content: { type: "roomList" } }));
}
function createRoom(roomKey, maxUsers) {
    send(
        JSON.stringify({
            type: "createroom",
            uuid: uuid,
            content: { roomKey: roomKey, maxUsers: maxUsers },
        }),
    );
}

const createGame = ref(undefined);
async function getGame() {
    const { createGame: createGameFn } = await import("~/game/main");
    createGame.value = createGameFn;
}
// Set focus to Phaser game
function setPhaserFocus() {
    const phaser = document.getElementById("phaser");
    if (phaser) phaser.focus();
}
// Emit events to Phaser game
function emitPhaserEvent(eventName) {
    if (window.$phaser?.eventEmitter) {
        window.$phaser.eventEmitter.emit(eventName, "default");
    }
}
// Set data in Phaser registry
function setData(key, data) {
    window.$phaser?.game.registry.set(key, data);
}
// Lifecycle hook
onMounted(async () => {
    refreshRooms();
    await getGame();
    nextTick(() => setPhaserFocus());
});
// Receive events from phaser
$bus.on("createroom", (args) => {
    //implement numplayers stuff
    //args: roomKey, numPlayers
    createRoom(args.roomKey, args.maxUsers);
});
$bus.on("refreshrooms", () => {
    //implement numplayers stuff
    //args: roomKey, numPlayers
    refreshRooms();
});
// $bus.on("joinroom", (key) => {});
</script>

<template>
    <PhaserGame :createGame="createGame" v-if="createGame" />
</template>
<style>
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}
</style>
