<script setup>
const { status, data, send, open } = useWebSocket(
    `ws://${location.host}/api/websocket`,
);
const message = ref("");
const username = ref("");
const history = ref([]);
watch(data, (newValue) => {
    console.log(newValue);
    let incoming = JSON.parse(newValue);

    history.value.unshift(incoming.username + ": " + incoming.message);
});
function sendData() {
    history.value.unshift(username.value + ": " + message.value);
    send(JSON.stringify({ username: username.value, message: message.value }));
    message.value = "";
}
</script>

<template>
    <div>
        <h1>Epic Chat!</h1>
        <h2>Set username!</h2>
        <input v-model="username" />
        <h2>Send Message!</h2>
        <form @submit.prevent="sendData">
            <input v-model="message" />
            <button type="submit">send</button>
        </form>
        <img width="300" src="../public/reindeer-panoramaridge.jpg" />
        <img width="300" src="../public/reindeer-nelsbight.jpg" />
        <div id="chat">
            <li v-for="item in history">
                {{ item }}
            </li>
        </div>
    </div>
</template>
