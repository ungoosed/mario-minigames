<script setup>
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";

const { status, data, send, open } = useWebSocket(
    `ws://${location.host}/api/minigames`,
);
const uuid = ref("");
const roomList = ref([]);
const message = ref("");

watch(data, (message) => {
    let parsed = JSON.parse(message);
    if (parsed.type == "uuid") {
        uuid.value = parsed.content;
    }
    if (parsed.type == "data") {
        if (parsed.content.type == "roomList") {
            roomList.value = parsed.content.data;
        }
    }
});
function sendData(type, content) {
    send(JSON.stringify({ type: type, uuid: uuid, content: content }));
}
function refreshRooms() {
    send(JSON.stringify({ type: "request", content: { type: "roomList" } }));
}
function newRoom() {
    send(
        JSON.stringify({
            type: "newroom",
            uuid: uuid,
            content: { roomKey: message.value },
        }),
    );
    message.value = "";
    refreshRooms();
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
    sendData("request", { type: "roomList" });

    await getGame();
    nextTick(() => setPhaserFocus());
});
</script>

<template>
    <h1>Room List</h1>
    <li v-for="room in roomList">
        Key: {{ room.roomKey }} users: {{ room.users }}
    </li>
    <button @click="refreshRooms()">refresh</button>
    <form @submit.prevent="newRoom()">
        <input v-model="message" />
        <button type="submit">create new room</button>
    </form>
    <button @click="sendData('join', { roomKey: 'reindeer' })">new room</button>
    <PhaserGame :createGame="createGame" v-if="createGame" />
</template>
