<template>
  <div class="home">
    <MyMap/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import MyMap from "@/components/MyMap.vue";

@Options({
  components: {MyMap},
})
export default class Home extends Vue {
}
</script>

<style>
.home {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
