<template>
  <div class="overlay" v-on:click="closeModal">
    <div class="content" v-on:click="stopPropagation">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  emits: ["close"],
  setup(props, context) {
    const closeModal = (event: MouseEvent) => {
      context.emit("close", event);
    }
    const stopPropagation = (event: MouseEvent) => {
      event.stopPropagation();
    }

    return {closeModal, stopPropagation}
  }
});
</script>

<style scoped>
.overlay {
  z-index: 11;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  z-index: 12;

  width: 90%;
  height: 90%;
}
</style>