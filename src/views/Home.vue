<template>
  <v-menu>
    <template v-slot:activator="{ props }" transition="scale-transition">
      <v-text-field
        label="search"
        variant="underlined"
        v-model="filterBy"
        @input="debouncedSetFilterBy"
        v-bind="props"
      ></v-text-field>
    </template>
    <SwList :swData="swData" :filterBy="getFilterBy"></SwList>
  </v-menu>
</template>

<script>
import { utilService } from "@/services/util.service.js";
import SwList from "@/components/SearchResultList.vue";

export default {
  data() {
    return {
      filterBy: ""
    };
  },
  async created() {
    this.debouncedSetFilterBy = utilService.debounce(this.setFilterBy, 200);
    await this.$store.dispatch({ type: "setCategory", category: "" });
  },
  methods: {
    setFilterBy() {
      this.$store.dispatch({ type: "setFilter", filterBy: this.filterBy });
    }
  },
  computed: {
    swData() {
      return this.$store.getters.swSearchResults;
    },
    getFilterBy() {
      return this.$store.getters.filterBy;
    }
  },
  components: { SwList }
};
</script>