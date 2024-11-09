<script setup>
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";
const { status, data, send, open } = useWebSocket(
    `ws://${location.host}/api/minigames`,
);
const uuid = ref("");
const { $bus } = useNuxtApp();

const roomList = useRoomList("roomList");
const roomData = useRoomData("roomData");
roomData.value = {
    roomKey: undefined,
    users: [],
};
// websocket stuff
watch(data, (message) => {
    let parsed = JSON.parse(message);
    if (parsed.type == "uuid") {
        uuid.value = parsed.content;
        console.log(uuid.value);
    }
    if (parsed.type == "data") {
        if (parsed.content.type == "roomList") {
            roomList.value = parsed.content.data;
            $bus.emit("newroomlist");
        }
        if (parsed.content.type == "roomData") {
            Object.assign(roomData.value, parsed.content.data);
            $bus.emit("newroomdata");
        }
    }
});

// phaser stuff
const createGame = ref(undefined);
async function getGame() {
    const { createGame: createGameFn } = await import("~/game/main");
    createGame.value = createGameFn;
}
function setPhaserFocus() {
    const phaser = document.getElementById("phaser");
    if (phaser) phaser.focus();
}
function emitPhaserEvent(eventName) {
    if (window.$phaser?.eventEmitter) {
        window.$phaser.eventEmitter.emit(eventName, "default");
    }
}
function setData(key, data) {
    window.$phaser?.game.registry.set(key, data);
}

// Lifecycle hook
onMounted(async () => {
    refreshRooms();
    await getGame();
    nextTick(() => setPhaserFocus());
});

// event listener stuff
function createRoom(args) {
    send(
        JSON.stringify({
            type: "createroom",
            uuid: uuid.value,
            content: { roomKey: args.roomKey, maxUsers: args.maxUsers },
        }),
    );
}
function refreshRooms() {
    send(JSON.stringify({ type: "request", content: { type: "roomList" } }));
}
function joinRoom(args) {
    send(
        JSON.stringify({
            type: "join",
            uuid: uuid.value,
            content: { roomKey: args.roomKey, name: "reindeer bufere!" },
        }),
    );
}
// Receive events from phaser
$bus.on("createroom", createRoom);
$bus.on("refreshrooms", refreshRooms);
$bus.on("joinroom", joinRoom);
onUnmounted(async () => {
    $bus.off("createroom", createRoom);
    $bus.off("refreshrooms", refreshRooms);
    $bus.off("joinroom", joinRoom);
});
</script>

<template>
    <PhaserGame :createGame="createGame" v-if="createGame" />
</template>
<style>
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
