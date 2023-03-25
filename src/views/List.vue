<template>
  <v-row v-if="results && results.length">
    <v-col v-for="result in results" :key="result" cols="12">
      <v-list>
        <v-list-subheader>{{ result.name }}</v-list-subheader>
      </v-list>
    </v-col>
    <button v-if="hasPrevPage" @click="getPage(-1)">Previous</button>
    <button v-if="hasNextPage" @click="getPage(1)">Next</button>
  </v-row>
  <v-row v-else>
    <v-col>
      <v-list>
        <v-list-subheader>No matching results</v-list-subheader>
      </v-list>
    </v-col>
    <RouterLink to="/">Back to home page</RouterLink>
  </v-row>
  <!-- <ResTable ></ResTable> -->
</template>

<script>
import ResTable from "@/components/Table.vue";

export default {
  async created() {
    const filterByParam = this.$route.params.filterBy;
    const categoryByParam = this.$route.params.category;
    if (filterByParam !== this.filterBy) this.$store.commit({ type: "setFilter", filterBy: filterByParam });
    await this.$store.dispatch({
      type: "setCategory",
      category: categoryByParam
    });
  },
  methods: {
    async getPage(diff) {
      try {
        await this.$store.dispatch({ type: "setPage", diff });
      } catch (err) {
        console.error(`Error while setting page => ${err.message}`);
        // Notification
      }
    }
  },
  computed: {
    results() {
      return this.$store.getters.categoryRes;
    },
    filterBy() {
      return this.$store.getters.filterBy;
    },
    hasNextPage() {
      return this.$store.getters.hasNextPage;
    },
    hasPrevPage() {
      return this.$store.getters.hasPrevPage;
    }
  },
  components: { ResTable }
};
</script>