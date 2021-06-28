<template>
  <div class="navigation-container">
    <svg class="arrow" viewBox="0 0 24 24" :style="arrowStyle">
      <path :d="mdiArrowUp"/>
    </svg>
    <h3 class="description">{{ description }} へ</h3>
    <h3 class="rem-dist-on-step">{{ remDistOnStep.toFixed(1) }} m</h3>
    <h4 class="rem-dist">{{ (remDist / 1e3).toFixed(2) }} km</h4>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {mdiArrowUp} from '@mdi/js';

export default defineComponent({
  props: {
    description: {
      type: String as PropType<string>,
      default: ""
    },
    remDistOnStep: {
      type: Number as PropType<number>,
      default: 0.0
    },
    remDist: {
      type: Number as PropType<number>,
      default: 0.0
    },
    bearing: {
      type: Number as PropType<number>,
      default: 0.0
    },
  },
  setup(props) {
    const arrowStyle = computed(() => ({
      '--bearing': `rotate(${props.bearing}deg)`
    }));

    return {mdiArrowUp, arrowStyle}
  }
})
</script>

<style scoped>
.navigation-container {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  border: 1px solid black;
  border-radius: 10px;
  height: 110px;
  background-color: white;
}

.description {
  position: absolute;
  top: 0;
  right: 20px;
}

.rem-dist-on-step {
  position: absolute;
  left: 115px;
  bottom: 0;
}

.rem-dist {
  position: absolute;
  right: 30px;
  bottom: 0;
}

.arrow {
  --bearing: 0deg;

  position: absolute;
  width: 100px;
  left: 10px;
  transform: var(--bearing);
}
</style>