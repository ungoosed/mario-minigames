<script setup>
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";
const { status, data, send, open } = useWebSocket(
    `ws://${location.host}/api/minigames`,
);
const { $bus } = useNuxtApp();

const roomList = useRoomList("roomList");
const gameState = useGameState("gameState");
const userData = useUserData("userData");

// websocket stuff
watch(data, (message) => {
    let parsed = JSON.parse(message);
    if (parsed.type == "uuid") {
        userData.value.uuid = parsed.content[0];
        userData.value.id = parsed.content[1];
        console.log("uuid");
        console.log(userData.value.uuid);
        console.log("id");
        console.log(userData.value.id);
    }
    if (parsed.type == "data") {
        if (parsed.content.type == "roomList") {
            roomList.value = parsed.content.data;
            $bus.emit("newroomlist");
        }
        if (parsed.content.type == "gameState") {
            Object.assign(gameState.value, parsed.content.data);
            $bus.emit("gamestate");
        }
    }
    if (parsed.type == "try") {
        $bus.emit("try", { id: parsed.id, data: parsed.data });
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
            uuid: userData.value.uuid,
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
            uuid: userData.value.uuid,
            id: userData.value.id,
            content: { roomKey: args.roomKey, name: userData.value.name },
        }),
    );
}
function leaveRoom() {
    send(
        JSON.stringify({
            type: "leave",
            uuid: userData.value.uuid,
        }),
    );
}
function update(args) {
    send(
        JSON.stringify({
            type: "update",
            uuid: userData.value.uuid,
            content: {
                roomKey: gameState.value.roomKey,
                data: args,
            },
        }),
    );
}
function targetUpdate(args) {
    send(
        JSON.stringify({
            type: "update",
            uuid: userData.value.uuid,
            content: {
                roomKey: gameState.value.roomKey,
                data: args.data,
                target: args.target,
            },
        }),
    );
}
function action(args) {
    send(
        JSON.stringify({
            type: "action",
            uuid: userData.value.uuid,
            id: userData.value.id,
            content: {
                roomKey: gameState.value.roomKey,
                data: args,
            },
        }),
    );
}
// Receive events from phaser
$bus.on("createroom", createRoom);
$bus.on("refreshrooms", refreshRooms);
$bus.on("joinroom", joinRoom);
$bus.on("leaveroom", leaveRoom);
$bus.on("update", update);
$bus.on("targetupdate", targetUpdate);
$bus.on("action", action);

onUnmounted(async () => {
    $bus.off("createroom", createRoom);
    $bus.off("refreshrooms", refreshRooms);
    $bus.off("joinroom", joinRoom);
    $bus.off("leaveroom", leaveRoom);
    $bus.off("targetupdate", targetUpdate);
    $bus.off("update", update);
    $bus.off("action", action);
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
#phaser {
    width: 90vw;
    height: 90vh;
}
</style>
