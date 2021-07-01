<template>
  <div class="search-container">
    <div class="search-input-container">
      <svg class="search-icon" viewBox="0 0 20 20">
        <path :d="searchIcon"/>
      </svg>
      <input id="search-input" v-model="query" type="search" placeholder="目的地" @keydown.enter="onInputEnter"
             autocomplete="off">
    </div>
    <div class="tab-container">
      <div v-for="(content, index) in tabContent" :key="index" v-bind:class="{'selected':index === tabIndex}"
           v-on:click="onTabClick(index)">{{ content.name }}
      </div>
    </div>
    <div v-if="searchResult !== []" class="result">
      <div v-for="(r, i) in searchResult[tabIndex]" :key="i" v-on:click="onItemClick(r)">
        <small class="loc-address">{{ r.address }}</small>
        <p class="loc-name">{{ r.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watch} from "vue";
import {mdiMagnify} from "@mdi/js";
import mapboxgl from "mapbox-gl";
import {SearchResult, LocalSearch, LocationSearch} from "@/composables/CompoundSearch";

export default defineComponent({
  props: {
    location: {
      type: Object as PropType<mapboxgl.LngLat | null>,
      required: true
    }
  },
  emits: ["result"],
  setup(props, context) {
    const query = ref("");
    const tabIndex = ref(0);
    const tabContent = [{
      name: "地名を検索",
      search: new LocationSearch()
    }, {
      name: "周辺を検索",
      search: new LocalSearch()
    }]
    const searchResult = ref<SearchResult[][]>([]);
    const searched = tabContent.map(() => "");

    function fetchQuery() {
      if (props.location && searched[tabIndex.value] != query.value) {
        searched[tabIndex.value] = query.value
        const search = tabContent[tabIndex.value].search;
        search.makePromise(query.value, props.location)
            .then<SearchResult[]>((json) => json.data)
            .then(r => searchResult.value[tabIndex.value] = r);
      }
    }

    const onInputEnter = () => {
      document.getElementById("search-input")?.blur();
      fetchQuery();
    }

    watch(tabIndex, () => {
      fetchQuery();
    })

    const onTabClick = (i: number) => {
      tabIndex.value = i;
    }

    const onItemClick = (searchResult: SearchResult) => {
      context.emit("result", searchResult);
      query.value = "";
    }

    return {
      query, searchIcon: mdiMagnify,
      onInputEnter, onTabClick, onItemClick, tabIndex, tabContent, searchResult
    }
  }
})
;
</script>

<style scoped>
.search-container {
  background-color: white;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
}

.search-input-container {
  border-bottom: 1px solid;

  display: flex;
}

.search-icon {
  margin: 10px;
  width: 30px;
}


#search-input {
  margin: 5px 10px 5px 0;
  width: 90%;
  left: 0;

  line-height: 40px;
  height: 42px;
}

.tab-container {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid;
}

.tab-container div {
  padding: 20px;
  cursor: pointer;
}

.tab-container .selected {
  color: teal;
  border-bottom: 3px solid teal;
}

div.result-container {
  position: relative;
}

div.result {
  overflow-y: scroll;
  flex: 1;
}

div.result div {
  margin: 10px;
  position: relative;

  cursor: pointer;
}

div.result .loc-address {
  position: absolute;
  text-align: right;
  right: 0;
}

div.result .loc-name {
  padding: 25px 0 5px 0;
  text-align: left;
  border-bottom: 1px solid;
}
</style>