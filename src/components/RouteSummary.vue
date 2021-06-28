<template>
  <div class="summary-container">
    <h3 class="summary">{{ summary }}</h3>
    <h4 class="distance">{{ distKm }}</h4>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";

export default defineComponent({
  props: {
    summary: {
      type: String as PropType<string>,
      default: ""
    },
    distance: {
      type: Number as PropType<number>,
      required: true
    }
  },
  setup(prop) {
    const distKm = computed(() => `${(prop.distance / 1000).toFixed(2)} km`);

    return {distKm}
  }
})
</script>

<style scoped>
.summary-container {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 25px;
  border: 1px solid black;
  border-radius: 10px;
  height: 110px;
  background-color: white;
}
.summary {
  text-align: left;
  margin-left: 20px;
}
.distance {
  text-align: left;
  margin-left: 40px;
}

@media all and (orientation: landscape) {
  .summary-container {
    height: 50px;
  }
  .summary {
    position: absolute;
    left: 20px;
  }
  .distance {
    position: absolute;
    right: 100px;
  }
}
</style>