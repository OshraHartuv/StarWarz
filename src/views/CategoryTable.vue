<template>
  <div>
    <v-row v-if="entities && entities.length">
      <v-col v-for="entity in entities" :key="entity" cols="12">
        <v-list>
          <v-list-subheader>{{ entity.name }}</v-list-subheader>
          <v-list-subheader
            @click="$router.push({ name: 'CategoryEdit', params: { category: $route.params.category, filterBy: $route.params.filterBy, id: entity.id } })"
          >Edit</v-list-subheader>
          <button @click="remove(entity.id)">Delete</button>
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
    <RouterView />
  </div>
</template>

<script>
export default {
  async created() {
    const filterByParam = this.$route.params.filterBy;
    const categoryByParam = this.$route.params.category;
    if (filterByParam !== this.filterBy)
      this.$store.commit({ type: "setFilter", filterBy: filterByParam });
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
    },
    async remove(id) {
      await this.$store.dispatch({
        type: "removeEntity",
        id
      });
    }
  },
  computed: {
    entities() {
      return this.$store.getters.categoryEntitiesPerPage;
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
  }
};
</script>