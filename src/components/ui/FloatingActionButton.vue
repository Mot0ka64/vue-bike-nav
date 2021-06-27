<template>
  <div id="fab" :style="styles" v-on:click="onClick">
    <span>
      <svg class="icon" viewBox="0 0 24 24">
        <path v-if='uiState === "Search"' :d="mdiMagnify"/>
        <path v-if='uiState === "Summary"' :d="mdiNearMe"/>
        <path v-if='uiState === "Navigation"' :d="mdiClose"/>
      </svg>
    </span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {UiState} from "@/composables/UiState";
import {mdiMagnify, mdiNearMe, mdiClose} from "@mdi/js";

export default defineComponent({
  props: {
    color: {
      type: String as PropType<string>,
      default: "green"
    },
    size: {
      type: String as PropType<string>,
      default: "50px"
    },
    bottom: {
      type: String as PropType<string>,
      default: "50px"
    },
    right: {
      type: String as PropType<string>,
      default: "50px"
    },
    uiState: {
      type: String as PropType<UiState>,
      required: true
    }
  },
  emits: ["clicked"],
  setup(props, context) {
    const onClick = () => {
      context.emit("clicked");
    }

    const styles = computed(() => ({
      '--color': props.color,
      '--size': props.size,
      '--bottom': props.bottom,
      '--right': props.right
    }));

    return {onClick, styles, mdiMagnify, mdiNearMe, mdiClose}
  }
})
</script>

<style scoped>
#fab {
  --color: green;
  --size: 50px;
  --bottom: 50px;
  --right: 50px;

  position: absolute;
  bottom: var(--bottom);
  right: var(--right);
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  background-color: var(--color);

  box-shadow: 3px 3px 3px #333;
  border-radius: 50%;
  color: #fff;
  text-align: center;
}

.icon {
  margin: 8px;
}

.icon path {
  fill: white;
}
</style>