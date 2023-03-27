<template>
  <div v-if="entities && entities.length">
    <v-data-table-server
      :headers="headers"
      hide-default-footer
      :items="entities"
      :loading="loading"
      item-value="name"
      class="elevation-1"
      @click:row="onRowClick"
    >
      <!-- @update:options="getUpdate" -->
      <template v-slot:bottom>
        <div class="text-center pt-2">
          <!-- <v-pagination v-model="page" :length="options.pageCount"></v-pagination> -->
        </div>
      </template>
    </v-data-table-server>
    <RouterView/>
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
      loading: true,
      page: 1
    };
  },
  async created() {
    this.loading = true;
    const filterByParam = this.$route.params.filterBy;
    const categoryByParam = this.$route.params.category;
    if (filterByParam !== this.filterBy)
      this.$store.commit({ type: "setFilter", filterBy: filterByParam });
    try {
      await this.$store.dispatch({
        type: "setCategory",
        category: categoryByParam
      });
    } catch (err) {
      console.error(`Error while setting category => ${err.message}`);
      // Notification
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async getPage(diff) {
      this.loading = true;
      try {
        await this.$store.dispatch({ type: "setPage", diff });
      } catch (err) {
        console.error(`Error while setting page => ${err.message}`);
        // Notification
      } finally {
        this.loading = false;
      }
    },
    async remove(id) {
      this.loading = true;
      try {
        await this.$store.dispatch({
          type: "removeEntity",
          id
        });
      } catch (err) {
        console.error(`Error while removing entity => ${err.message}`);
        //Notification
      } finally {
        this.loading = false;
      }
    },
    onRowClick(ev, {item}) {
      if (!item) return;
      const id = item.raw.id;
      this.$router.push({ name: 'CategoryEdit', params: { category: this.$route.params.category, filterBy: this.$route.params.filterBy, id } })
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
            sortable: true,
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