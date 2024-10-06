<script setup>
import { useWebSocket } from "@vueuse/core";

const { status, data, send, open } = useWebSocket(
    `ws://${location.host}/api/websocket`,
);
const message = ref("");
const history = ref([]);
const recent = ref("");
watch(data, (newValue) => {
    history.value.push(`server: ${newValue}`);
    recent.value = newValue;
});
function sendData() {
    history.value.push("client: " + message.value);
    send(message.value);
    message.value = "";
}
</script>

<template>
    rec
    <div>
        <h1>Yipee reindeer</h1>
        <p>{{ recent.value }}</p>
        <form @submit.prevent="sendData">
            <input v-model="message" />
            <button type="submit">send</button>
        </form>
    </div>
</template>
