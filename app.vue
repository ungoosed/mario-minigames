<script>
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";
async function getGame() {
    const { createGame } = await import("~/game/game");
    return createGame;
}

const setPhaserFocus = () => {
    const phaser = document.getElementById("phaser");
    // if (phaser) phaser.focus();
};

export default {
    name: "IndexPage",
    components: { PhaserGame },
    data() {
        return {
            createGame: undefined,
        };
    },
    methods: {
        emitPhaserEvent(eventName) {
            this.$phaser?.eventEmitter?.emit(eventName, "default");
        },
        jump() {
            this.emitPhaserEvent("jump");
        },
        walkLeft() {
            this.emitPhaserEvent("walkLeft");
        },
        walkRight() {
            this.emitPhaserEvent("walkRight");
        },
        pause() {
            this.emitPhaserEvent("pause");
        },
        resume() {
            this.emitPhaserEvent("resume");
        },
    },
    async mounted() {
        this.createGame = await getGame();
        this.$nextTick(() => setPhaserFocus());
    },
};
</script>
<template>
    <div>
        <Chat id="hi" />
        <PhaserGame :createGame="createGame" v-if="createGame" />
    </div>
</template>
