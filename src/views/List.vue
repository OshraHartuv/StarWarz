<template>
  <v-row>
    <v-col v-for="result in results" :key="result" cols="12">
      <v-card>
        <v-list>
          <v-list-subheader>{{ result.name }}</v-list-subheader>
        </v-list>
      </v-card>
    </v-col>
    <button v-if="hasPrevPage" @click="getPage(-1)">Previous</button>
    <button v-if="hasNextPage" @click="getPage(1)">Next</button>
  </v-row>
  <!-- <ResTable ></ResTable> -->
</template>

<script>
import ResTable from "@/components/Table.vue";

export default {
  watch: {
    categoryParam: {
      async handler(category) {
        try {
          await this.$store.dispatch({ type: "setCategory", category });
        } catch (err) {
          console.error(`Error while setting category => ${err.message}`);
          // Notification
        }
      },
      deep: true,
      immediate: true
    },
    filterByParam: {
      async handler(filterBy) {
        if (this.filterBy && this.filterBy === filterBy) return;
        try {
          console.log('not the same filtur');
          await this.$store.dispatch({ type: "setFilter", filterBy });
        } catch (err) {
          console.error(`Error while setting filter => ${err.message}`);
          // Notification
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getPage(diff) {
      try{
        await this.$store.dispatch({ type: "setPage", diff });
      }catch(err){
        console.error(`Error while setting page => ${err.message}`);
        // Notification
      }
    }
  },
  computed: {
    categoryParam() {
      return this.$route.params.category;
    },
    filterByParam() {
      return this.$route.params.filterBy;
    },
    results() {
      return this.$store.getters.categoryRes;
    },
    filterBy() {
      return this.$store.getters.filterBy;
    },
    hasNextPage() {
      return this.$store.getters.hasNextPage
    },
    hasPrevPage() {
      return this.$store.getters.hasPrevPage
    }
  },
  components: { ResTable }
};
</script>