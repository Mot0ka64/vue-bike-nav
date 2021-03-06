<template>
  <div class="navigation-container">
    <svg class="arrow" viewBox="0 0 24 24" :style="arrowStyle">
      <path :d="mdiArrowUp"/>
    </svg>
    <h3 v-show="data.description" class="description">{{ data.description }} へ</h3>
    <h3 class="rem-dist-on-step">{{ data.remainingDistanceOnStep.toFixed(1) }} m</h3>
    <h4 class="dest-description">目的地まで</h4>
    <h4 class="rem-dist">{{ (data.remainingDistance / 1e3).toFixed(2) }} km</h4>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {mdiArrowUp} from '@mdi/js';
import {NavigationData} from "@/composables/UiType";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<NavigationData>,
      required: true
    },
  },
  setup(props) {
    const arrowStyle = computed(() => ({
      '--bearing': `rotate(${props.data.bearing}deg)`
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
  height: 95px;
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

.dest-description {
  display: none;
}

@media all and (orientation: landscape) {
  .navigation-container {
    bottom: 20px;
    width: 120px;
    height: auto;
  }

  .description {
    top: 90px;
    left: 10px;
    right: auto;
  }

  .rem-dist-on-step {
    left: 10px;
    top: 130px;
    bottom: auto;
  }

  .rem-dist {
    right: 10px;
    bottom: 0;
    font-size: 120%;
  }

  .arrow {
    left: 0;
  }

  .dest-description {
    display: block;
    position: absolute;
    bottom: 40px;
    left: 10px;
  }
}
</style>