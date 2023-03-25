<template>
  <v-row>
    <v-col v-for="result in results" :key="result" cols="12">
      <v-card>
        <v-list>
          <v-list-subheader>{{ result.name }}</v-list-subheader>
        </v-list>
      </v-card>
    </v-col>
    <button v-if="hasPrevPage" @click="getPage(-1)">Prev</button>
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
          console.log("err ", err);
        }
      },
      deep: true,
      immediate: true
    },
    filterByParam: {
      async handler(filterBy) {
        if (this.filterBy && this.filterBy === filterBy) return;
        try {
          await this.$store.dispatch({ type: "setFilter", filterBy });
        } catch (err) {
          console.log("err ", err);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getPage(diff) {
      await this.$store.dispatch({ type: "setPage", diff });
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
    count() {
      return this.$store.getters.categoryCount;
    },
    filterBy() {
      return this.$store.getters.filterBy;
    },
    pageIdx() {
      return this.$store.state.pageIdx;
    },
    pageSize() {
      return this.$store.state.pageSize;
    },
    hasNextPage() {
      return this.count > (this.pageIdx + 1) * this.pageSize;
    },
    hasPrevPage() {
      return this.pageIdx > 0;
    }
  },
  components: { ResTable }
};
</script>