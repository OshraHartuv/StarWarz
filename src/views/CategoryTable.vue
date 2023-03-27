<template>
  <div v-if="entities && entities.length">
    <v-hover v-slot="{ isHovering, props }">
      <v-data-table
        :headers="headers"
        hide-default-footer
        :items="entities"
        :loading="loading"
        item-value="name"
        :items-length="totalItems"
        class="elevation-1"
        @hover:row="hovering"
        :elevation="isHovering ? 12 : 2"
        :class="{ 'on-hover': isHovering }"
        v-bind="props"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            :class="{ 'show-btn': isHovering, 'hide-btn': !isHovering }"
            class="mr-5 btn"
            @click="editEntity(item.raw)"
          >Edit</v-btn>
          <v-btn
            class="btn"
            :class="{ 'show-btn': isHovering, 'hide-btn': !isHovering }"
            @click="removeEntity(item.raw)"
          >Delete</v-btn>
        </template>

        <!-- @update:options="options=$event" -->
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <!-- <v-pagination v-model="page" :length="options.pageCount"></v-pagination> -->
          </div>
        </template>
      </v-data-table>
    </v-hover>
    <RouterView />
  </div>
</template>

<script>
import { utilService } from "@/services/util.service.js";

export default {
  data() {
    return {
      transparent: "rgba(255, 255, 255, 0)",
      options: {
        pageCount: 1
      },
      totalItems: 0,
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
    async removeEntity({ id }) {
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
    editEntity({ id }) {
      this.$router.push({
        name: "CategoryEdit",
        params: {
          category: this.$route.params.category,
          filterBy: this.$route.params.filterBy,
          id
        }
      });
    },
    hovering() {
      console.log("yesss");
    }
  },
  computed: {
    entities() {
      return this.$store.getters.categoryEntitiesPerPage;
    },
    headers() {
      const headers = Object.keys(this.entities[0])
        .filter(key => key !== "id")
        .map((key, idx) => {
          return {
            title: utilService.formatString(key),
            align: idx ? "end" : "start",
            sortable: true,
            key: key
          };
        });
      headers.push({
        title: "",
        align: "end",
        key: "actions",
        sortable: false
      });
      return headers;
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

<style scoped>
.v-data-table-server {
  transition: opacity 0.4s ease-in-out;
}

.v-data-table-server:not(.on-hover) {
  opacity: 0.6;
}

.btn {
  transition: opacity 0.2s linear;
}

.show-btn {
  opacity: 1;
}
.hide-btn {
  opacity: 0;
}
</style>