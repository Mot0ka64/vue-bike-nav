<template>
  <MyMap/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import {Options, Vue} from 'vue-class-component';
import MyMap from "@/components/MyMap.vue";

@Options({
  components: {MyMap},
})
export default class App extends Vue {
}
</script>