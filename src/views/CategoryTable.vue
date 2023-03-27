<template>
  <div v-if="entities && entities.length">
    <v-data-table
      :headers="headers"
      hide-default-footer
      :items="entities"
      item-value="name"
      class="elevation-1"
      @update="getUpdate"
    >
      <template v-slot:bottom>
        <div class="text-center pt-2">
          <!-- <v-pagination v-model="page" :length="options.pageCount"></v-pagination> -->
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { utilService } from "@/services/util.service.js";

export default {
  data() {
    return {
      options: {
        pageCount: 1
      },
      page: 1
    };
  },
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
      try {
        await this.$store.dispatch({
          type: "removeEntity",
          id
        });
      } catch (err) {
        console.error(`Error while removing entity => ${err.message}`);
        //Notification
      }
    }
  },
  computed: {
    entities() {
      return this.$store.getters.categoryEntitiesPerPage;
    },
    headers() {
      return Object.keys(this.entities[0])
        .filter(key => key !== "id")
        .map((key, idx) => {
          return {
            title: utilService.formatString(key),
            align: idx ? "end" : "start",
            sortable: false,
            key: key
          };
        });
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